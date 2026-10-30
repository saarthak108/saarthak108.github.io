import { PageHead } from '../components/PageHead';
import { achievements } from '../data/profile';
import { useMotion, useTitle } from '../lib/useMotion';

export function Achievements() {
  useTitle('Achievements');
  const root = useMotion<HTMLDivElement>();
  const awards = achievements.filter((a) => a.kind === 'Award');
  const certs = achievements.filter((a) => a.kind === 'Certification');
  // "2× Gold" counts as two distinctions.
  const distinctions = awards.reduce((n, a) => n + (a.title.match(/^(\d+)×/)?.[1] ? Number(a.title.match(/^(\d+)×/)![1]) : 1), 0);

  return (
    <div ref={root}>
      <PageHead
        index="05"
        label="Achievements"
        aside="Awards & Certifications"
        title={<>Recognised <em className="serif">work.</em></>}
        lede="Honours from the Delhi CG Animation Awards, and industry certifications from Adobe and Autodesk."
      />

      <section className="ach-stats wrap" data-reveal data-section="Summary">
        <div><span className="display">{String(distinctions).padStart(2, '0')}</span><span className="mono dim">Award distinctions</span></div>
        <div><span className="display">{String(certs.length).padStart(2, '0')}</span><span className="mono dim">Certifications</span></div>
        <div><span className="display">02</span><span className="mono dim">Consecutive years honoured — 2022 · 2023</span></div>
      </section>

      {[
        { label: 'Awards', list: awards },
        { label: 'Certifications', list: certs },
      ].map((group) => (
        <section key={group.label} className="ach wrap" data-section={group.label}>
          <div className="rule-label mono"><span>{group.label}</span><span className="dim">{String(group.list.length).padStart(2, '0')}</span></div>
          <ol className="ach__list">
            {group.list.map((a, i) => (
              <li key={a.title} className="ach__item" data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
                <span className="ach__year display">{a.year ?? '—'}</span>
                <div className="ach__body">
                  <h3 className="ach__title display">{a.title}</h3>
                  <p className="mono dim">{a.issuer}</p>
                  {a.detail && <p className="ach__detail">{a.detail}</p>}
                </div>
                {a.href ? (
                  <a className="ach__link mono" href={a.href} target="_blank" rel="noopener noreferrer">View ↗</a>
                ) : (
                  <span className="ach__link ach__link--pending mono" title="Add a link in src/data/profile.ts">Link pending</span>
                )}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
