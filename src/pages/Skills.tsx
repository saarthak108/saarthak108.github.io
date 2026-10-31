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
  const [open, setOpen] = useState<string | null>(null);

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
        <div className="rule-label mono"><span>A / Software</span><span className="dim">Select a tool for details</span></div>
        <div className="kit__groups mono" role="group" aria-label="Highlight a category">
          {toolGroups.map((g) => (
            <button key={g.id} className={group === g.id ? 'is-active' : ''} aria-pressed={group === g.id} onClick={() => setGroup(group === g.id ? null : g.id)}>
              {g.label}
            </button>
          ))}
        </div>
        <div className="kit__layout">
          <ul className={`kit__tools ${group ? 'has-filter' : ''} ${open ? 'has-open' : ''}`}>
            {tools.map((t, i) => {
              const isOpen = open === t.name;
              const id = `tool-${i}`;
              return (
                <li
                  key={t.name}
                  className={`kit__tool ${group === t.group ? 'is-on' : ''} ${isOpen ? 'is-open' : ''}`}
                  data-reveal
                  style={{ ['--d' as string]: `${i * 35}ms` }}
                >
                  <button className="kit__head" aria-expanded={isOpen} aria-controls={id} onClick={() => setOpen(isOpen ? null : t.name)}>
                    <span className="kit__name display">{t.name}</span>
                    <span className="kit__group mono">{toolGroups.find((g) => g.id === t.group)?.label}</span>
                    <span className="kit__icon" aria-hidden="true" />
                  </button>
                  <div className="kit__brief" id={id} role="region" aria-hidden={!isOpen}>
                    <div>
                      <p>{t.brief}</p>
                      {t.note && <p className="mono dim">{t.note}</p>}
                      {t.usedIn && (
                        <p className="mono kit__used">
                          Used in:{' '}
                          {t.usedIn.map((s, j) => (
                            <span key={s}>{j > 0 && ', '}<Link to={`/work/${s}`} tabIndex={isOpen ? 0 : -1}>{getProject(s)?.title}</Link></span>
                          ))}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <aside className="kit__panel">
            <span className="mono label">Also in the pipeline</span>
            <ul className="kit__pipeline">
              {pipeline.map((p) => <li key={p}>{p}</li>)}
            </ul>
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
