import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PageHead } from '../components/PageHead';
import { Render } from '../components/Render';
import { Lightbox, lightboxItems, type LightboxItem } from '../components/Lightbox';
import { bySection, formatDuration, projects, practice, sections, type Project, type Section } from '../data/projects';
import { scrollToY } from '../lib/motion';
import { useMotion, useTitle } from '../lib/useMotion';

type Box = { items: LightboxItem[]; index: number; thumbs?: boolean };

const pad = (n: number) => String(n).padStart(2, '0');

function jump(id: string, immediate = false) {
  const el = document.getElementById(id);
  if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY - 80, immediate);
}

const envs = bySection('environments');
const archs = bySection('archviz');
const envBox = lightboxItems(envs);
const practiceBox = lightboxItems(practice);
const counts: Record<Section, number> = { environments: envs.length, archviz: archs.length, practice: practice.length };

/** A clickable project tile. Video projects play a short muted preview on hover. */
function Card({ p, n, ratio, sizes, badge, onOpen, className = '' }: { p: Project; n: number; ratio?: string; sizes: string; badge?: string; onOpen: () => void; className?: string }) {
  const vid = useRef<HTMLVideoElement>(null);
  return (
    <button
      className={`card ${className}`}
      onClick={onOpen}
      onMouseEnter={() => vid.current?.play().catch(() => {})}
      onMouseLeave={() => vid.current?.pause()}
      aria-label={`Open ${p.title}`}
      data-reveal
    >
      <span className="card__media">
        <Render img={p.cover} ratio={ratio} parallax={ratio ? 5 : undefined} sizes={sizes} />
        {p.video && <video ref={vid} className="card__preview" src={p.video.preview} muted loop playsInline preload="none" aria-hidden="true" />}
        {badge && <span className="card__badge mono">{badge}</span>}
        <span className="card__view mono">{p.video ? '▶ Play' : p.renders.length > 1 ? 'View renders' : 'View'}</span>
      </span>
      <span className="card__cap">
        <span className="mono dim">{pad(n)}</span>
        <span className="card__title">{p.title}</span>
        <span className="mono dim card__meta">{[p.studio, p.location].filter(Boolean).join(' · ') || p.category}</span>
      </span>
    </button>
  );
}

export function Work() {
  useTitle('Work');
  const root = useMotion<HTMLDivElement>();
  const [box, setBox] = useState<Box | null>(null);
  const close = useCallback(() => setBox(null), []);
  const change = useCallback((index: number) => setBox((b) => b && { ...b, index }), []);
  const { hash } = useLocation();

  // Deep links like /work#archviz land on that section (after the route's scroll-to-top).
  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => jump(hash.slice(1), true), 150);
    return () => clearTimeout(t);
  }, [hash]);


  return (
    <div ref={root}>
      <PageHead
        index="01"
        label="Work"
        aside={`(${pad(projects.length + practice.length)}) pieces`}
        title={<>Selected <em className="serif">work</em></>}
        lede="Real-time environments, architecture for studios, and the practice in between. Select any piece for the full view and its story."
      />

      <nav className="filters wrap mono" aria-label="Jump to section">
        {sections.map((s) => (
          <button key={s.id} onClick={() => jump(s.id)}>
            {s.index} — {s.title} <span className="dim">({pad(counts[s.id])})</span>
          </button>
        ))}
      </nav>

      {sections.map((s) => (
        <section key={s.id} id={s.id} className={`wsec wsec--${s.id} wrap`} data-section={s.title}>
          <header className="wsec__head" data-reveal>
            <span className="wsec__index display">{s.index}</span>
            <h2 className="wsec__title display">{s.title}</h2>
            <p className="wsec__lede">{s.lede}</p>
            <span className="mono dim wsec__count">{pad(counts[s.id])} {s.id === 'archviz' ? 'projects' : s.id === 'practice' ? 'renders' : 'projects'}</span>
          </header>

          {s.id === 'environments' && (
            <div className="envs">
              {envs.map((p, i) => (
                <Card
                  key={p.slug}
                  p={p}
                  n={i + 1}
                  className={i === 0 ? 'card--lead' : i < 3 ? 'card--half' : ''}
                  ratio={i === 0 ? '21/9' : '16/10'}
                  sizes={i === 0 ? '100vw' : i < 3 ? '(max-width: 760px) 100vw, 50vw' : '(max-width: 760px) 100vw, 33vw'}
                  badge={p.video ? `Film · ${formatDuration(p.video.duration)}` : 'Still'}
                  onOpen={() => setBox({ items: envBox.items, index: envBox.start[p.slug] })}
                />
              ))}
            </div>
          )}

          {s.id === 'archviz' && (
            <div className="archs">
              {archs.map((p, i) => (
                <Card
                  key={p.slug}
                  p={p}
                  n={i + 1}
                  className={i === 0 ? 'card--lead' : ''}
                  ratio={i === 0 ? '21/9' : '3/2'}
                  sizes={i === 0 ? '100vw' : '(max-width: 760px) 100vw, 50vw'}
                  badge={`${pad(p.renders.length)} renders`}
                  onOpen={() => setBox({ items: lightboxItems([p]).items, index: 0, thumbs: true })}
                />
              ))}
            </div>
          )}

          {s.id === 'practice' && (
            <div className="practice">
              {practice.map((p, i) => (
                <Card
                  key={p.slug}
                  p={p}
                  n={i + 1}
                  sizes="(max-width: 760px) 50vw, 33vw"
                  onOpen={() => setBox({ items: practiceBox.items, index: i })}
                />
              ))}
            </div>
          )}
        </section>
      ))}

      <Lightbox items={box?.items ?? []} index={box ? box.index : null} onChange={change} onClose={close} thumbs={box?.thumbs} />
    </div>
  );
}
