// Central image registry for the hand-picked stills. Renders imported from the project
// library (ArchViz, practice renders, video posters) live in media.json — see projects.ts.
//
// To add/replace a render:
//   1. Put the source file in /img as work-<key>.jpg
//   2. Run `npm run images` (writes <key>.webp, <key>-md.webp, <key>-sm.webp to public/renders)
//   3. Add or update the entry below with its real pixel width/height.

export type ImageAsset = {
  key: string;
  alt: string;
  width: number;
  height: number;
  /** Placeholder entries render a styled frame instead of a file. */
  placeholder?: boolean;
  /** CSS object-position focal point, used when the image is cropped. */
  focus?: string;
};

const base = import.meta.env.BASE_URL;

export const images = {
  aldrheim: { key: 'aldrheim', alt: 'The Valley of Aldrheim — fantasy valley environment in Unreal Engine 5', width: 1080, height: 1920, focus: '50% 60%' },
  observer: { key: 'observer', alt: 'The Silent Observer — a lone figure in a sci-fi corridor facing a planet, rendered in Blender', width: 1024, height: 1408, focus: '50% 45%' },
  castle: { key: 'castle', alt: 'Medieval Castle — fortress environment in Unreal Engine 5', width: 1920, height: 1080, focus: '60% 50%' },
  ganesha: { key: 'ganesha', alt: 'Hidden Temple of Ganesha — submerged temple with a Ganesha statue', width: 1920, height: 1080, focus: '50% 40%' },
  wildwest: { key: 'wildwest', alt: 'Wild West — frontier town game environment', width: 1920, height: 1080, focus: '55% 55%' },
  pyramid: { key: 'pyramid', alt: 'The Lost Pyramid — pyramid rising above a misty jungle canopy', width: 1920, height: 1080, focus: '50% 45%' },
  apoc: { key: 'apoc', alt: 'Overgrown roadway with barriers, utility poles and a water tower reclaimed by forest', width: 1920, height: 1080, focus: '55% 55%' },
  space: { key: 'space', alt: 'A dark planet with glowing red fissures in space', width: 1920, height: 1080, focus: '55% 50%' },
  portrait: { key: 'portrait', alt: 'Portrait of Saarthak Maharana', width: 1100, height: 1473, focus: '50% 30%' },
} satisfies Record<string, ImageAsset>;

export type ImageSize = 'sm' | 'md' | 'lg';

export function src(img: ImageAsset, size: ImageSize = 'md') {
  if (img.key === 'portrait') return `${base}renders/portrait.webp`;
  const suffix = size === 'lg' ? '' : `-${size}`;
  return `${base}renders/${img.key}${suffix}.webp`;
}

export function srcSet(img: ImageAsset) {
  if (img.key === 'portrait') return undefined;
  return `${src(img, 'sm')} 560w, ${src(img, 'md')} 1100w, ${src(img, 'lg')} 2000w`;
}
