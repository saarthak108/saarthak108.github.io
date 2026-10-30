import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FloatingRenders } from '../components/FloatingRenders';
import { Render } from '../components/Render';
import { featuredProjects, projects, practice } from '../data/projects';
import { identity, services, achievements, experience } from '../data/profile';
import { images, type ImageAsset } from '../data/images';
import { useMotion, useTitle } from '../lib/useMotion';

const directory: { to: string; title: string; note: string; img: ImageAsset }[] = [
  { to: '/gallery', title: 'Gallery', note: 'The render exhibition', img: images.pyramid },
  { to: '/about', title: 'About', note: 'Practice & philosophy', img: images.portrait },
  { to: '/experience', title: 'Experience', note: 'Studio, freelance, training', img: images.observer },
  { to: '/achievements', title: 'Achievements', note: 'Awards & certifications', img: images.ganesha },
  { to: '/skills', title: 'Skills', note: 'Software & capabilities', img: images.wildwest },
];

export function Home() {
  useTitle('');
  const hero = useRef<HTMLElement>(null);
  const root = useMotion<HTMLDivElement>();
  const current = experience.find((e) => e.current);
  const awards = achievements.filter((a) => a.kind === 'Award');

  return (
    <div ref={root}>
      {/* ---------- Hero: fly-through of floating renders ---------- */}
      <section className="hero" ref={hero} data-section="Intro">
        <div className="hero__stage">
          <FloatingRenders track={hero} />
          <div className="hero__vignette" aria-hidden="true" />

          <div className="hero__intro">
            <p className="mono label hero__kicker">
              <span className="dot" /> {identity.role} — {identity.location}
            </p>
            <h1 className="hero__name display">
              <span>Saarthak</span>
              <span>Maharana</span>
            </h1>
            <p className="hero__tag">
              Crafting worlds <em className="serif">beyond imagination.</em>
            </p>
            <div className="hero__actions">
              <Link to="/work" className="btn btn--solid">↗ Selected work</Link>
              <Link to="/gallery" className="btn btn--ghost">Render gallery</Link>
            </div>
          </div>

          <p className="hero__statement display" aria-hidden="true">
            Every frame built to hold up as a <em className="serif">still.</em>
          </p>

          <div className="hero__meta mono">
            <span>Scroll to enter</span>
            <span className="hero__meta-list">Unreal Engine 5 · Blender · D5 Render · ComfyUI</span>
          </div>
        </div>
      </section>

      {/* ---------- Introduction ---------- */}
      <section className="intro wrap" data-section="Profile">
        <div className="rule-label mono"><span>01 / Profile</span><span className="dim">Est. 2020 — 3D & VFX</span></div>
        <p className="intro__statement" data-reveal>
          I build immersive 3D environments for games, cinematics and architecture — bringing{' '}
          <em className="serif">atmosphere, storytelling</em> and technical polish together, from first blockout to the final frame.
        </p>
        <dl className="facts" data-reveal>
          <div><dt className="mono">Based in</dt><dd>{identity.location}</dd></div>
          {current && <div><dt className="mono">Currently</dt><dd>{current.org}</dd></div>}
          <div><dt className="mono">Recognition</dt><dd>{awards.length} awards · Delhi CG Animation Awards</dd></div>
          <div><dt className="mono">Engines</dt><dd>Unreal Engine 5 · Blender</dd></div>
        </dl>
        <Link to="/about" className="link-arrow mono">More about the practice →</Link>
      </section>

      {/* ---------- Selected work ---------- */}
      <section className="sel wrap" data-section="Selected Work">
        <div className="rule-label mono">
          <span>02 / Selected Work</span>
          <Link to="/work" className="dim">All {projects.length + practice.length} pieces →</Link>
        </div>
        <h2 className="sel__title display" data-reveal>
          Worlds that pull <em className="serif">you inside.</em>
        </h2>
        <div className="sel__grid">
          {featuredProjects.map((p, i) => (
            <Link key={p.slug} to={`/work/${p.slug}`} className={`sel__item sel__item--${i}`} data-reveal>
              <Render img={p.cover} ratio="16/9" parallax={8} sizes="(max-width: 760px) 100vw, 55vw" />
              <div className="sel__cap">
                <span className="mono dim">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                <span className="mono dim">{p.studio ?? p.software ?? p.category}{p.studio || p.software ? ` · ${p.category}` : ""}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Capabilities ticker ---------- */}
      <section className="ticker" aria-label="Capabilities" data-section="Capabilities">
        <div className="ticker__row">
          {[0, 1].map((k) => (
            <div className="ticker__set mono" key={k} aria-hidden={k === 1}>
              {services.flatMap((s) => s.items).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Directory ---------- */}
      <section className="dir wrap" data-section="Directory">
        <div className="rule-label mono"><span>03 / Directory</span><span className="dim">The full portfolio</span></div>
        <ol className="dir__list">
          {directory.map((d, i) => (
            <li key={d.to} data-reveal style={{ ['--d' as string]: `${i * 60}ms` }}>
              <Link to={d.to} className="dir__row">
                <span className="mono dim">{String(i + 1).padStart(2, '0')}</span>
                <span className="dir__title display">{d.title}</span>
                <span className="dir__note mono">{d.note}</span>
                <span className="dir__thumb" aria-hidden="true">
                  <Render img={d.img} ratio="4/3" size="sm" sizes="200px" />
                </span>
                <span className="dir__arrow" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
