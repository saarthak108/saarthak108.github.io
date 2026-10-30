import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHead } from '../components/PageHead';
import { pipeline, services, toolGroups, tools } from '../data/profile';
import { getProject } from '../data/projects';
import { useMotion, useTitle } from '../lib/useMotion';

export function Skills() {
  useTitle('Skills');
  const root = useMotion<HTMLDivElement>();
  const [group, setGroup] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const focused = tools.find((t) => t.name === hover);

  return (
    <div ref={root}>
      <PageHead
        index="06"
        label="Skills"
        aside={`${tools.length} tools · ${services.length} disciplines`}
        title={<>Industry tools, <em className="serif">ambitious worlds.</em></>}
        lede="The software behind the work — from real-time engines and terrain generators to post-production and AI-assisted pipelines."
      />

      <section className="kit wrap" data-section="Software">
        <div className="rule-label mono"><span>A / Software</span><span className="dim">Hover a tool for context</span></div>
        <div className="kit__groups mono" role="group" aria-label="Highlight a category">
          {toolGroups.map((g) => (
            <button key={g.id} className={group === g.id ? 'is-active' : ''} aria-pressed={group === g.id} onClick={() => setGroup(group === g.id ? null : g.id)}>
              {g.label}
            </button>
          ))}
        </div>
        <div className="kit__layout">
          <ul className={`kit__tools ${group ? 'has-filter' : ''}`}>
            {tools.map((t, i) => (
              <li
                key={t.name}
                className={`kit__tool ${group === t.group ? 'is-on' : ''}`}
                onMouseEnter={() => setHover(t.name)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(t.name)}
                onBlur={() => setHover(null)}
                tabIndex={0}
                data-reveal
                style={{ ['--d' as string]: `${i * 35}ms` }}
              >
                <span className="kit__name display">{t.name}</span>
                <span className="kit__group mono">{toolGroups.find((g) => g.id === t.group)?.label}</span>
              </li>
            ))}
          </ul>
          <aside className="kit__panel" aria-live="polite">
            {focused ? (
              <>
                <span className="mono label">{toolGroups.find((g) => g.id === focused.group)?.label}</span>
                <p className="kit__panel-name display">{focused.name}</p>
                {focused.note && <p className="dim-2">{focused.note}</p>}
                {focused.usedIn && (
                  <p className="mono dim">
                    Used in: {focused.usedIn.map((s) => getProject(s)?.title).join(', ')}
                  </p>
                )}
              </>
            ) : (
              <>
                <span className="mono label">Also in the pipeline</span>
                <ul className="kit__pipeline">
                  {pipeline.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </>
            )}
          </aside>
        </div>
      </section>

      <section className="caps wrap" data-section="Capabilities">
        <div className="rule-label mono"><span>B / Technical capabilities</span><span className="dim">What I deliver</span></div>
        <div className="caps__grid">
          {services.map((s, i) => (
            <article key={s.title} className="caps__item" data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
              <span className="mono dim">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="display">{s.title}</h3>
              <ul className="mono">
                {s.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </article>
          ))}
          <Link to="/contact" className="caps__item caps__item--cta" data-reveal>
            <span className="mono dim">→</span>
            <h3 className="display">Start a <em className="serif">project</em></h3>
            <span className="mono dim">Reply within 48 hours</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
