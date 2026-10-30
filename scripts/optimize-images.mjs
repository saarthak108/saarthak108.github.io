// Converts source renders in img/ into responsive WebP files in public/renders/.
// Drop a new JPG/PNG into img/ (named work-<slug>.jpg) and run `npm run images`.
import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'node:fs';
import { join, parse } from 'node:path';

const SRC = 'img';
const OUT = 'public/renders';
const SIZES = [{ suffix: '', width: 2000 }, { suffix: '-md', width: 1100 }, { suffix: '-sm', width: 560 }];

mkdirSync(OUT, { recursive: true });

for (const file of readdirSync(SRC)) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue;
  const name = parse(file).name.replace(/^work-/, '');
  for (const { suffix, width } of SIZES) {
    await sharp(join(SRC, file))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: suffix === '-sm' ? 72 : 80 })
      .toFile(join(OUT, `${name}${suffix}.webp`));
  }
  const meta = await sharp(join(SRC, file)).metadata();
  console.log(`${name}: ${meta.width}x${meta.height}`);
}
