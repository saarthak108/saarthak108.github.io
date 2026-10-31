// Imports the project library (ArchViz folders, practice renders, environment videos)
// into web-ready files and writes src/data/media.json, which src/data/projects.ts reads.
//
//   npm run import                 # everything
//   npm run import -- images       # renders only (fast)
//   npm run import -- video        # videos only
//
// Source folder defaults to D:/Website/My projects; override with PROJECTS_DIR.
// Expected layout:
//   Archviz/<Project folder>/<NN>_ <Title> - <Studio> - <Location> - <Year>[ - hero].webp
//   Practice renders/*.png|jpg
//   Unreal & Blender Projects/*.mp4
import sharp from 'sharp';
import ffmpeg from 'ffmpeg-static';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, parse } from 'node:path';

const SRC = process.env.PROJECTS_DIR || 'D:/Website/My projects';
const RENDERS = 'public/renders';
const VIDEO = 'public/video';
const MANIFEST = 'src/data/media.json';
const SIZES = [{ suffix: '', width: 2000 }, { suffix: '-md', width: 1100 }, { suffix: '-sm', width: 560 }];
const only = process.argv[2];
// Poster frame time (seconds) where the default third-of-the-way frame isn't representative.
const POSTER_AT = { 'porsche-gt4-rs': 18 };

const slugify = (s) => s.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};

async function writeSizes(input, key) {
  mkdirSync(parse(join(RENDERS, key)).dir, { recursive: true });
  for (const { suffix, width } of SIZES) {
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: suffix === '-sm' ? 72 : 80 })
      .toFile(join(RENDERS, `${key}${suffix}.webp`));
  }
  const { width, height } = await sharp(input).metadata();
  return { key, width, height };
}

async function importArchviz() {
  const root = join(SRC, 'Archviz');
  manifest.archviz = {};
  for (const folder of readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory())) {
    const slug = slugify(folder.name);
    const files = readdirSync(join(root, folder.name)).filter((f) => /\.(webp|jpe?g|png)$/i.test(f)).sort();
    const renders = [];
    for (const [i, file] of files.entries()) {
      // "<NN>_ <Title> - <Studio> - <Location> - <Year>[ - hero]"
      const parts = parse(file).name.replace(/^\d+_\s*/, '').split(' - ').map((s) => s.trim());
      const hero = parts.at(-1)?.toLowerCase() === 'hero';
      if (hero) parts.pop();
      const [title, studio, location, year] = parts;
      const named = title && title !== 'Untitled';
      const r = await writeSizes(join(root, folder.name, file), `archviz/${slug}-${String(i + 1).padStart(2, '0')}`);
      renders.push({ ...r, hero, ...(named ? { title, studio, location, year } : {}) });
    }
    manifest.archviz[slug] = { folder: folder.name, renders };
    console.log(`archviz/${slug}: ${renders.length} renders`);
  }
}

async function importPractice() {
  const root = join(SRC, 'Practice renders');
  manifest.practice = [];
  for (const file of readdirSync(root).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort()) {
    const n = file.match(/(\d+)/)?.[1] ?? String(manifest.practice.length + 1);
    manifest.practice.push({ ...(await writeSizes(join(root, file), `practice/practice-${n}`)), file });
  }
  console.log(`practice: ${manifest.practice.length} renders`);
}

function probe(file) {
  const run = spawnSync(ffmpeg, ['-hide_banner', '-i', file], { encoding: 'utf8' });
  if (run.error) throw run.error;
  const out = run.stderr;
  const [, h, m, s] = out.match(/Duration: (\d+):(\d+):([\d.]+)/);
  const [, w, ht] = out.match(/Video:.*?, (\d{3,5})x(\d{3,5})/);
  return { duration: +h * 3600 + +m * 60 + +s, width: +w, height: +ht };
}

// Letterbox bars (top/bottom only), detected over a few seconds, so posters and previews fill
// their frames. Ignored unless the crop keeps full width and most of the height — dark scenes
// can otherwise read as "bars". The bars are assumed symmetric.
function detectCrop(file, at, width, height) {
  const out = spawnSync(ffmpeg, ['-hide_banner', '-ss', String(at), '-t', '4', '-i', file, '-vf', 'cropdetect=24:2:0', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const m = [...out.matchAll(/crop=(\d+):(\d+):(\d+):(\d+)/g)].at(-1);
  if (!m) return undefined;
  const [w, h] = [+m[1], +m[2]];
  if (h >= height - 8 || h < height * 0.6) return undefined;
  if (w === width) return `${width}:${h}:0:${m[4]}`;
  // A dark scene shrank the detection too; if it sits inside a 2.39:1 band, crop to that band.
  const bar = Math.round((height - width / 2.39) / 2);
  return +m[4] >= bar - 16 && +m[4] + h <= height - bar + 16 ? `${width}:${height - 2 * bar}:0:${bar}` : undefined;
}

async function importVideos() {
  const root = join(SRC, 'Unreal & Blender Projects');
  mkdirSync(VIDEO, { recursive: true });
  manifest.videos = {};
  for (const file of readdirSync(root).filter((f) => /\.(mp4|mov|mkv)$/i.test(f)).sort()) {
    const input = join(root, file);
    const slug = slugify(parse(file).name);
    const { duration, width, height } = probe(input);
    // Fit inside 1920x1080 (either orientation), H.264 + AAC, streamable.
    const scale = width >= height ? "scale='min(1920,iw)':-2" : "scale=-2:'min(1920,ih)'";
    const full = join(VIDEO, `${slug}.mp4`);
    if (!existsSync(full)) {
      execFileSync(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', '-i', input, '-vf', scale,
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '25', '-maxrate', '4M', '-bufsize', '8M', '-pix_fmt', 'yuv420p',
        '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', full], { stdio: 'inherit' });
    }
    // Short, silent, low-res loop for hover previews on the Work page.
    const at = Math.max(0, duration * 0.2);
    const crop = detectCrop(input, duration * 0.3, width, height);
    const cropF = crop ? `crop=${crop},` : '';
    execFileSync(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', '-ss', String(at), '-t', '6', '-i', input,
      '-vf', cropF + (width >= height ? 'scale=720:-2' : 'scale=-2:720'), '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '30',
      '-pix_fmt', 'yuv420p', '-movflags', '+faststart', join(VIDEO, `${slug}-preview.mp4`)]);
    // Thumbnail: an image next to the video with the same name (e.g. "The Lost Pyramid.jpg") wins;
    // otherwise a frame from about a third of the way in, unless overridden above.
    const custom = ['.jpg', '.jpeg', '.png', '.webp'].map((ext) => join(root, parse(file).name + ext)).find(existsSync);
    const frame = custom ?? execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-ss', String(POSTER_AT[slug] ?? duration * 0.35), '-i', input,
      ...(crop ? ['-vf', `crop=${crop}`] : []), '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'png', '-'], { maxBuffer: 1 << 28 });
    const poster = await writeSizes(frame, `env/${slug}`);
    if (custom) console.log(`  thumbnail from ${parse(custom).base}`);
    manifest.videos[slug] = { file, duration: Math.round(duration), width, height, poster };
    console.log(`video/${slug}: ${Math.round(duration)}s ${width}x${height}${crop ? ` letterbox crop ${crop}` : ''}`);
  }
}

if (!only || only === 'images') {
  await importArchviz();
  await importPractice();
}
if (!only || only === 'video') await importVideos();
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`wrote ${MANIFEST}`);
