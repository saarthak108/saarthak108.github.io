import { PageHead } from '../components/PageHead';
import { Render } from '../components/Render';
import type { ImageAsset } from '../data/images';
import { bySection, practice } from '../data/projects';
import { useMotion, useTitle } from '../lib/useMotion';

// Every image from the project library, each shown once: all ArchViz renders, all practice
// renders and a frame from each film. Dealt round-robin so renders of the same project
// are spread apart. New renders added through `npm run import` appear here automatically.
const queues: ImageAsset[][] = [
  ...bySection('archviz').map((p) => [...p.renders]),
  practice.map((p) => p.cover),
  bySection('environments').flatMap((p) => (p.video ? [p.video.poster] : [])),
];
const stills: ImageAsset[] = [];
while (queues.some((q) => q.length)) queues.forEach((q) => q.length && stills.push(q.shift()!));

export function Gallery() {
  useTitle('Gallery');
  const root = useMotion<HTMLDivElement>();

  return (
    <div ref={root}>
      <PageHead
        index="02"
        label="Gallery"
        aside={`${stills.length} images`}
        title={<>The render <em className="serif">exhibition</em></>}
        lede="Architecture, environments and practice — one continuous wall of frames to scroll through."
      />

      {/* Masonry columns: each image keeps its own proportions and the columns rebalance at any width. */}
      <section className="wall wrap" data-section="Exhibition">
        {stills.map((img) => (
          <div key={img.key} className="wall__item" data-reveal>
            <Render img={img} sizes="(max-width: 760px) 50vw, (max-width: 1200px) 33vw, 25vw" />
          </div>
        ))}
      </section>
    </div>
  );
}
