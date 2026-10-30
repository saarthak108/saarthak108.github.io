import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Render } from '../components/Render';
import { images } from '../data/images';
import { aiWorkflow, bio, faq, identity, principles } from '../data/profile';
import { useMotion, useTitle } from '../lib/useMotion';

export function About() {
  useTitle('About');
  const root = useMotion<HTMLDivElement>();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div ref={root}>
      <section className="about wrap" data-section="About">
        <div className="rule-label mono"><span>03 / About</span><span className="dim">{identity.location}</span></div>
        <div className="about__grid">
          <figure className="about__portrait" data-reveal>
            <Render img={images.portrait} ratio="4/5" sizes="(max-width: 760px) 100vw, 40vw" eager />
            <figcaption className="mono dim">{identity.name} — {identity.roles.join(' & ')}</figcaption>
          </figure>
          <div className="about__text">
            <h1 className="about__lead display" data-reveal>
              Hi, I’m Saarthak — I build places you can <em className="serif">step into.</em>
            </h1>
            <p className="about__bio" data-reveal>{bio.lead}</p>
            {bio.paragraphs.map((p) => (
              <p key={p} className="dim-2" data-reveal>{p}</p>
            ))}
            <div className="about__links mono" data-reveal>
              <Link to="/experience">Experience →</Link>
              <Link to="/achievements">Achievements →</Link>
              <Link to="/skills">Toolkit →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="principles wrap" data-section="Approach">
        <div className="rule-label mono"><span>Approach</span><span className="dim">How the work gets made</span></div>
        <h2 className="section-title display" data-reveal>
          Fast-track your <em className="serif">virtual worlds.</em>
        </h2>
        <ol className="principles__list">
          {principles.map((p, i) => (
            <li key={p.title} data-reveal style={{ ['--d' as string]: `${i * 100}ms` }}>
              <span className="principles__num display">{String(i + 1).padStart(2, '0')}</span>
              <h3>{p.title}</h3>
              <p className="dim-2">{p.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="ai wrap" data-section="AI Workflow">
        <div className="ai__inner" data-reveal>
          <span className="mono label">AI Workflow</span>
          <h2 className="display">{aiWorkflow.title.replace('ComfyUI', '')}<em className="serif">ComfyUI</em></h2>
          <p className="dim-2">{aiWorkflow.body}</p>
          <svg className="ai__nodes" viewBox="0 0 320 120" aria-hidden="true">
            <path d="M40 60 C 90 60, 90 25, 140 25 M40 60 C 90 60, 90 95, 140 95 M180 25 C 220 25, 220 60, 270 60 M180 95 C 220 95, 220 60, 270 60" />
            <rect x="10" y="48" width="44" height="24" rx="4" /><rect x="132" y="13" width="56" height="24" rx="4" />
            <rect x="132" y="83" width="56" height="24" rx="4" /><rect x="262" y="48" width="48" height="24" rx="4" />
          </svg>
        </div>
      </section>

      <section className="faq wrap" data-section="FAQ">
        <div className="rule-label mono"><span>Questions</span><span className="dim">{String(faq.length).padStart(2, '0')}</span></div>
        <div className="faq__list">
          {faq.map((f, i) => (
            <div key={f.q} className={`faq__item ${open === i ? 'is-open' : ''}`}>
              <button aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                <span className="mono dim">{String(i + 1).padStart(2, '0')}</span>
                <span className="faq__q">{f.q}</span>
                <span className="faq__icon" aria-hidden="true" />
              </button>
              <div className="faq__a"><div><p className="dim-2">{f.a}</p></div></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
