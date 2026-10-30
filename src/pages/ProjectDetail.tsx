import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Render } from '../components/Render';
import { Lightbox, lightboxItems } from '../components/Lightbox';
import { src } from '../data/images';
import { bySection, formatDuration, getProject, nextProject, sections } from '../data/projects';
import { useMotion, useTitle } from '../lib/useMotion';
import { NotFound } from './NotFound';

export function ProjectDetail() {
  const { slug = '' } = useParams();
  const project = getProject(slug);
  useTitle(project?.title ?? 'Not found');
  const root = useMotion<HTMLDivElement>([slug]);
  const [box, setBox] = useState<number | null>(null);
  const views = useMemo(() => (project ? lightboxItems([project]).items : []), [project]);
  if (!project) return <NotFound />;

  const next = nextProject(slug);
  const section = sections.find((s) => s.id === project.section)!;
  const siblings = bySection(project.section);
  const index = siblings.indexOf(project) + 1;
  const portrait = project.cover.height > project.cover.width;
  // Lightbox index of the first still (the film, when present, is item 0).
  const firstStill = project.video ? 1 : 0;

  const meta = [
    ['Section', section.title],
    ['Category', project.category],
    ['Studio', project.studio],
    ['Location', project.location],
    ['Year', project.year],
    ['Software', project.software],
    ['Film', project.video && formatDuration(project.video.duration)],
    ['Renders', project.renders.length > 1 ? String(project.renders.length) : undefined],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <div ref={root} className="pd">
      <section className={`pd__hero ${portrait ? 'pd__hero--portrait' : ''}`} data-section="Project">
        <div className="pd__hero-media">
          <Render img={project.cover} ratio={portrait ? undefined : '16/9'} size="lg" sizes="100vw" parallax={portrait ? undefined : 10} eager />
        </div>
        <div className="pd__hero-text wrap">
          <Link to={`/work#${project.section}`} className="mono label link-back">← {section.title}</Link>
          <p className="mono label">{section.title} {String(index).padStart(2, '0')} / {String(siblings.length).padStart(2, '0')}</p>
          <h1 className="pd__title display">{project.title}</h1>
        </div>
      </section>

      <section className="pd__body wrap" data-section="Overview">
        <dl className="pd__meta mono" data-reveal>
          {meta.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
        <div className="pd__text">
          <p className="pd__lede" data-reveal>{project.summary}</p>
          {project.description.map((d) => (
            <p key={d} data-reveal className="dim-2">{d}</p>
          ))}
        </div>
      </section>

      {project.video && (
        <section className="pd__film wrap" data-section="Film">
          <div className="rule-label mono"><span>Film</span><span className="dim">{formatDuration(project.video.duration)}</span></div>
          <video src={project.video.src} poster={src(project.video.poster, 'lg')} controls playsInline preload="none" data-reveal />
        </section>
      )}

      {project.renders.length > 0 && (
        <section className="pd__gallery wrap" data-section="Renders">
          <div className="rule-label mono"><span>Renders</span><span className="dim">Click to view full screen</span></div>
          <div className={`pd__grid ${project.renders.length === 1 ? 'pd__grid--single' : ''}`}>
            {project.renders.map((img, i) => {
              const tall = img.height > img.width;
              return (
                <button
                  key={img.key}
                  className={`pd__shot ${tall ? 'pd__shot--tall' : ''} ${i === 0 && project.renders.length > 1 ? 'pd__shot--lead' : ''}`}
                  onClick={() => setBox(firstStill + i)}
                  aria-label={`View render ${i + 1} full screen`}
                  data-reveal
                >
                  <Render img={img} size={i === 0 ? 'lg' : 'md'} sizes={i === 0 ? '100vw' : '(max-width: 760px) 100vw, 50vw'} />
                </button>
              );
            })}
          </div>
        </section>
      )}

      <Link to={`/work/${next.slug}`} className="pd__next" data-section="Next">
        <Render img={next.cover} ratio="21/9" size="md" sizes="100vw" parallax={12} />
        <div className="pd__next-text wrap">
          <span className="mono label">Next project</span>
          <span className="display pd__next-title">{next.title} →</span>
        </div>
      </Link>

      <Lightbox items={views} index={box} onChange={setBox} onClose={() => setBox(null)} thumbs={views.length > 2} />
    </div>
  );
}
