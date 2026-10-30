import { images, type ImageAsset } from './images';
import mediaJson from './media.json';

// Centralized project data, in three sections:
//   environments — Unreal & Blender projects (cinematic video + stills)
//   archviz      — architectural visualization projects (one folder of renders each)
//   practice     — individual practice renders
//
// Files come from the project library via `npm run import`, which writes media.json.
// Titles, studios, locations and years for ArchViz are read from the file names.
// Briefs describe what is visible in each piece — edit them freely.

type MediaRender = { key: string; width: number; height: number; hero?: boolean; title?: string; studio?: string; location?: string; year?: string };
type Media = {
  archviz: Record<string, { folder: string; renders: MediaRender[] }>;
  practice: (MediaRender & { file: string })[];
  videos: Record<string, { file: string; duration: number; width: number; height: number; poster: MediaRender }>;
};
const media = mediaJson as unknown as Media;
const base = import.meta.env.BASE_URL;

export type Section = 'environments' | 'archviz' | 'practice';

export const sections: { id: Section; index: string; title: string; lede: string }[] = [
  { id: 'environments', index: '01', title: '3D Environments', lede: 'Real-time worlds and cinematics built in Unreal Engine and Blender.' },
  { id: 'archviz', index: '02', title: 'Architectural Visualization', lede: 'Architecture rendered for studios — every project a set of views. Select one to step through its renders.' },
  { id: 'practice', index: '03', title: 'Practice Renders', lede: 'Lighting, material and composition studies made between projects.' },
];

export type Video = { src: string; preview: string; poster: ImageAsset; width: number; height: number; duration: number };

export type Project = {
  slug: string;
  title: string;
  section: Section;
  /** Short line under the title. */
  category: string;
  software?: string;
  studio?: string;
  location?: string;
  year?: string;
  /** Card / hero image. */
  cover: ImageAsset;
  /** Every still, cover first. Cycled through in the lightbox. */
  renders: ImageAsset[];
  video?: Video;
  summary: string;
  description: string[];
};

const asset = (r: MediaRender, alt: string, focus?: string): ImageAsset => ({ key: r.key, width: r.width, height: r.height, alt, focus });

function video(slug: string, title: string): Video {
  const v = media.videos[slug];
  return {
    src: `${base}video/${slug}.mp4`,
    preview: `${base}video/${slug}-preview.mp4`,
    poster: asset(v.poster, `${title} — frame from the cinematic`),
    width: v.width,
    height: v.height,
    duration: v.duration,
  };
}

type EnvInput = Omit<Project, 'section' | 'cover' | 'renders' | 'video'> & { videoSlug?: string; stills?: ImageAsset[] };
function env({ videoSlug, stills = [], ...p }: EnvInput): Project {
  const v = videoSlug ? video(videoSlug, p.title) : undefined;
  const cover = v?.poster ?? stills[0];
  return { ...p, section: 'environments', video: v, cover, renders: stills };
}

type ArchInput = Pick<Project, 'title' | 'category' | 'summary' | 'description' | 'software'> & { location?: string };
function arch(slug: string, p: ArchInput): Project {
  const all = media.archviz[slug].renders;
  // Hero render(s) first, then the rest in folder order.
  const ordered = [...all.filter((r) => r.hero), ...all.filter((r) => !r.hero)];
  const named = all.find((r) => r.title);
  const renders = ordered.map((r, i) => asset(r, `${p.title} — render ${i + 1} of ${all.length}`));
  return {
    slug,
    section: 'archviz',
    studio: named?.studio?.replace('Arcitects', 'Architects'),
    location: p.location ?? named?.location,
    year: named?.year,
    cover: renders[0],
    renders,
    ...p,
  };
}

export const projects: Project[] = [
  // ---------------------------------------------------------------- 3D Environments
  env({
    slug: 'valley-of-aldrheim',
    title: 'The Valley of Aldrheim',
    category: 'Fantasy Valley',
    software: 'Unreal Engine 5',
    videoSlug: 'the-valley-of-aldrheim',
    stills: [images.aldrheim],
    summary: 'A fantasy valley of timber dwellings, forest and a watchful statue beneath snow-capped peaks.',
    description: [
      'Weathered timber houses sit along a winding dirt path that leads the eye up the valley to snow-capped mountains; in the film, a winged statue keeps watch over the forest.',
      'Built in Unreal Engine 5, the scene balances dense set dressing with open sky, giving the valley a sense of scale and quiet habitation.',
    ],
  }),
  env({
    slug: 'the-nuclear-plant',
    title: 'The Nuclear Plant',
    category: 'Industrial Environment',
    videoSlug: 'the-nuclear-plant',
    summary: 'A sprawling industrial wasteland of cooling towers, smokestacks and rusting pipework.',
    description: [
      'Cooling towers and smoking chimneys rise over a field of corroded pipelines and heavy structure under a pale, hazy sky.',
      'Staged as a one-minute cinematic, the environment is built for scale: layers of industrial silhouettes recede into the haze.',
    ],
  }),
  env({
    slug: 'apocalyptic-road',
    title: 'Apocalyptic Road',
    category: 'Post-Apocalyptic',
    videoSlug: 'apocalyptic-road',
    stills: [images.apoc],
    summary: 'An abandoned roadway slowly reclaimed by forest.',
    description: [
      'Concrete barriers, leaning utility poles and a distant water tower line a cracked road where puddles, leaf litter and ferns have taken over.',
      'Dense, layered foliage and soft daylight tell the story of a place left behind.',
    ],
  }),
  env({
    slug: 'medieval-castle',
    title: 'Medieval Castle',
    category: 'Fortress Design',
    software: 'Unreal Engine 5',
    videoSlug: 'medieval-castle-main',
    stills: [images.castle],
    summary: 'A fortress crowning a rocky ridge, caught in warm low sun.',
    description: [
      'A castle complex of towers and curtain walls sits on a rocky ridge, approached by a path cut through broken stone and dense foliage.',
      'Warm, low-angle sunlight and distant mountains give the fortress weight and atmosphere, built in Unreal Engine 5.',
    ],
  }),
  env({
    slug: 'wild-west',
    title: 'Wild West',
    category: 'Frontier Town',
    videoSlug: 'wildwestshot',
    stills: [images.wildwest],
    summary: 'A sun-baked frontier street of canvas tents, timber fences and saloon fronts.',
    description: [
      'A frontier town environment: a dusty main street lined with canvas tents, wagons, fences and clapboard buildings, red sandstone cliffs behind.',
      'Bright midday light and a clear sky keep the space readable — designed to be walked through, not just looked at.',
    ],
  }),
  env({
    slug: 'the-lost-pyramid',
    title: 'The Lost Pyramid',
    category: 'Jungle Ruins',
    videoSlug: 'the-lost-pyramid',
    stills: [images.pyramid],
    summary: 'A stepped pyramid rising out of a misty rainforest canopy.',
    description: [
      'Seen from above the treeline, a stepped pyramid emerges from an unbroken jungle canopy, mist pooling in the valleys between mountain ridges.',
      'The composition is built around scale — a vast organic foreground and a single architectural landmark.',
    ],
  }),
  env({
    slug: 'porsche-gt4-rs',
    title: 'Porsche GT4 RS',
    category: 'Automotive Cinematic',
    videoSlug: 'porsche-gt4-rs',
    software: 'Blender',
    summary: 'A vertical automotive film: the GT4 RS goes from clay render to final, parked in a concrete garage.',
    description: [
      'The film opens on untextured clay passes — showing the model and lighting setup — before resolving into the finished car in gloss black, framed by board-formed concrete and planting.',
    ],
  }),
  env({
    slug: 'taj-mahal',
    title: 'Taj Mahal',
    category: 'Heritage Visualization',
    videoSlug: 'tajmahal-renders-compilation2',
    summary: 'The Taj Mahal recreated in 3D — the classic axial view down the reflecting pool and gardens.',
    description: [
      'A compilation of rendered views: the mausoleum and minarets framed by the long water channel, paths and planted lawns of the charbagh, under a bright, cloud-scattered sky.',
    ],
  }),
  env({
    slug: 'the-silent-observer',
    title: 'The Silent Observer',
    category: 'Cinematic Realism',
    software: 'Blender',
    videoSlug: 'spaceshipmain',
    stills: [images.observer],
    summary: 'A lone figure at the end of a long corridor, watching a planet turn beyond the glass.',
    description: [
      'A symmetrical, low-key interior: hard-surface panels and floor lines converge on a single figure framed against a vast window and the curve of a planet.',
      'Lit almost entirely by the world outside, the render leans on negative space and restraint to carry its cinematic tone. The accompanying film moves through the ship toward the window.',
    ],
  }),
  env({
    slug: 'hidden-temple-of-ganesha',
    title: 'Hidden Temple of Ganesha',
    category: 'Cultural Art',
    software: 'Blender',
    stills: [images.ganesha],
    summary: 'A sacred statue of Lord Ganesha discovered in a submerged, light-shafted temple.',
    description: [
      'A diver-like figure approaches a monumental statue of Lord Ganesha resting in a drowned temple, carved stone shrines rising on either side.',
      'Volumetric light falling from the surface turns the water teal and gives the sculpture a quiet, reverent presence.',
    ],
  }),
  env({
    // Title is descriptive — rename here if the piece has an official name.
    slug: 'crimson-planet',
    title: 'Crimson Planet',
    category: 'Space Study',
    stills: [images.space],
    summary: 'A dark world with glowing red fissures, half-lit against deep space.',
    description: [
      'A planet study: rust-toned continents and swirling cloud bands on the day side, red fissures glowing through the darkness on the night side.',
    ],
  }),

  // ---------------------------------------------------------------- Architectural Visualization
  arch('kasauli-trident', {
    title: 'Kasauli Trident',
    category: 'Hillside Residences',
    summary: 'Hillside homes set into a pine forest in Kasauli, Himachal Pradesh.',
    description: [
      'A cluster of pitched-roof residences in timber, stone and glass, stepped into a forested slope.',
      'The set moves from aerial context views through the forest down to the arrival court and individual homes, with wildflower planting and soft morning light tying architecture to landscape.',
    ],
  }),
  arch('karyan-nine', {
    title: 'Karyan NINE',
    category: 'Mixed-Use Tower',
    summary: 'A mixed-use tower with a ribbed façade and a sweeping, planted podium canopy.',
    description: [
      'Exterior views show the tower’s vertical fins and the curved canopy that wraps the podium; interior views move into a planted atrium with a spiral stair and layered balconies.',
      'The set closes on calm, daylit residential interiors.',
    ],
  }),
  arch('b56', {
    title: 'B56',
    category: 'Private Residence',
    summary: 'A contemporary residence with landscaped terraces and a double-height living space.',
    description: [
      'Interiors centre on a double-height living room with a sculptural spiral stair, full-height glazing and soft curtain light, followed by lounge and bedroom views.',
      'Exterior views show the stacked, terraced volumes wrapped in planting.',
    ],
  }),
  arch('jindal', {
    title: 'Jindal',
    category: 'Concrete Residence',
    summary: 'A monolithic concrete building with a bold cantilevered volume.',
    description: [
      'Board-marked concrete, a cantilevered upper volume and a perforated screen wall, framed by cherry blossom, lawn and a reflecting pool.',
    ],
  }),
  arch('nfc', {
    title: 'NFC',
    category: 'Concrete Interiors',
    summary: 'Monolithic concrete interiors under a deep coffered ceiling.',
    description: [
      'A study in raw concrete: sculpted stairs, a coffered ceiling, tall glazed doors and a top-lit gravel courtyard, lit to bring out texture and depth.',
    ],
  }),
  arch('gemba-fitness-studio', {
    title: 'Fitness Studio',
    category: 'Interior — Fitness',
    summary: 'A warm, flowing fitness studio interior in Kalkaji, New Delhi.',
    description: [
      'Curved ceiling coves, arched portals and pale timber give a reformer studio a soft, calm character, lit with concealed linear lighting.',
    ],
  }),
  arch('westfield-mumbai', {
    title: 'Westfield Mumbai',
    category: 'Commercial Block',
    summary: 'A mid-rise commercial building shown from street, aerial and night views.',
    description: [
      'Day views establish the building in its streetscape and landscaping; aerial and dusk views add traffic light-trails and city context, closing on a night render under the stars.',
    ],
  }),
];

// ---------------------------------------------------------------- Practice renders
// Titles are descriptive (the files are numbered) — rename freely.
const practiceText: Record<string, [string, string]> = {
  '001': ['The Gate', 'Two curved monoliths frame a glowing disc above a flooded, misty hall — a study in reflection and volumetric haze.'],
  '002': ['Gilded Skull', 'A crowned skull in polished gold against an ornate black frame — a metallic material and lighting study.'],
  '003': ['Hangar', 'A white SUV under hard strip lights in a dark hangar — automotive lighting and reflections.'],
  '004': ['Ringed World', 'A green, ringed planet drifting through an asteroid field and nebula.'],
  '005': ['Event Horizon', 'A black hole bending its glowing accretion disc around a field of stars.'],
  '006': ['Breakfast', 'A stylised breakfast still life — pancakes, coffee and syrup — with soft, warm daylight.'],
  '007': ['Golden Hand', 'A skeletal hand and roses cast in gold within an ornate ring — a jewellery-style material study.'],
  '008': ['Overgrown', 'Moss-covered skeletons lying in a field of orange blossoms — texture, scatter and storytelling.'],
  '009': ['Neon Alley', 'A rain-soaked alley washed in teal neon, a classic car parked in the reflections.'],
  '010': ['Hyperlane', 'An aerial view down a futuristic city, light trails streaking along an elevated highway.'],
};

export const practice: Project[] = media.practice.map((r) => {
  const n = r.key.split('-').pop()!;
  const [title, summary] = practiceText[n] ?? [`Practice Render ${n}`, ''];
  const img = asset(r, `${title} — practice render`);
  return { slug: `practice-${n}`, title, section: 'practice', category: 'Practice Render', cover: img, renders: [img], summary, description: [] };
});

// ---------------------------------------------------------------- Lookups
export const bySection = (s: Section) => (s === 'practice' ? practice : projects.filter((p) => p.section === s));

// Home-page Selected Work, in order (shown as four 16:9 frames).
const featuredOrder = ['valley-of-aldrheim', 'the-nuclear-plant', 'apocalyptic-road', 'the-lost-pyramid'];
export const featuredProjects = featuredOrder.map((s) => projects.find((p) => p.slug === s)).filter((p): p is Project => Boolean(p));

/** Stills for the floating home-page composition, in display order. */
export const showcase: ImageAsset[] = [
  images.castle, bySection('archviz')[0].cover, images.observer, images.pyramid, bySection('archviz')[1].cover,
  images.aldrheim, images.ganesha, bySection('archviz')[2].cover, images.wildwest, images.apoc, bySection('archviz')[3].cover, images.space,
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function nextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}

export function formatDuration(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
