import { useEffect, useRef } from 'react';
import { PageHead } from '../components/PageHead';
import { education, experience, type TimelineEntry } from '../data/profile';
import { gsap } from '../lib/motion';
import { useMotion, useTitle } from '../lib/useMotion';

function Timeline({ entries, label, idx }: { entries: TimelineEntry[]; label: string; idx: string }) {
  const line = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!line.current) return;
    const tween = gsap.fromTo(
      line.current,
      { scaleY: 0 },
      { scaleY: 1, ease: 'none', scrollTrigger: { trigger: line.current.parentElement, start: 'top 70%', end: 'bottom 60%', scrub: true } },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section className="tl wrap" data-section={label}>
      <div className="rule-label mono"><span>{idx} / {label}</span><span className="dim">{String(entries.length).padStart(2, '0')} entries</span></div>
      <ol className="tl__list">
        <span className="tl__line" aria-hidden="true"><span ref={line} /></span>
        {entries.map((e) => (
          <li key={e.org} className={`tl__item ${e.current ? 'is-current' : ''}`} data-reveal>
            <span className="tl__year display">{e.start}</span>
            <span className="tl__node" aria-hidden="true" />
            <div className="tl__body">
              <p className="mono label">{e.period}{e.current && <span className="tl__live">Current</span>}</p>
              <h3 className="tl__org display">{e.org}</h3>
              {e.role && <p className="tl__role">{e.role}</p>}
              {e.detail && <p className="dim-2">{e.detail}</p>}
              {e.pending && <p className="pending mono">{e.pending}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Experience() {
  useTitle('Experience');
  const root = useMotion<HTMLDivElement>();
  return (
    <div ref={root}>
      <PageHead
        index="04"
        label="Experience"
        aside="2020 — Present"
        title={<>Path to the <em className="serif">studio.</em></>}
        lede="From 3D & VFX training at MAAC to freelance environment and ArchViz work, and now studio production at Altrune Studio."
      />
      <Timeline entries={experience} label="Professional" idx="A" />
      <Timeline entries={education} label="Education" idx="B" />
    </div>
  );
}
