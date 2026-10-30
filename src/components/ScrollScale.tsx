import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToY } from '../lib/motion';

type Marker = { label: string; at: number; top: number };

const TICKS = 100;

/**
 * Precision-instrument scroll scale fixed to the right edge.
 * Reads sections from [data-section="Label"] on the current page.
 */
export function ScrollScale() {
  const { pathname } = useLocation();
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [active, setActive] = useState(0);
  const thumb = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(0);

  // Measure section positions whenever the page or its height changes.
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const els = [...document.querySelectorAll<HTMLElement>('[data-section]')];
        setMarkers(
          els.map((el) => {
            const top = el.getBoundingClientRect().top + window.scrollY;
            return { label: el.dataset.section || '', top, at: Math.min(1, Math.max(0, top / max)) };
          }),
        );
      });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    const t = window.setTimeout(measure, 150);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [pathname]);

  // Track scroll position every frame without re-rendering React.
  useEffect(() => {
    let raf = 0;
    let last = -1;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const y = window.scrollY;
      if (y === last) return;
      last = y;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, y / max));
      if (thumb.current) thumb.current.style.setProperty('--p', p.toFixed(4));
      if (readout.current) readout.current.textContent = String(Math.round(p * 100)).padStart(3, '0');
      let idx = 0;
      markers.forEach((m, i) => {
        if (m.top <= y + window.innerHeight * 0.45) idx = i;
      });
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [markers]);

  return (
    <aside className="scale" aria-label="Page sections">
      <div className="scale__track" aria-hidden="true">
        {Array.from({ length: TICKS + 1 }, (_, i) => (
          <span key={i} className={`scale__tick ${i % 10 === 0 ? 'is-major' : i % 5 === 0 ? 'is-mid' : ''}`} style={{ top: `${i}%` }}>
            {i % 20 === 0 && <em>{String(i).padStart(2, '0')}</em>}
          </span>
        ))}
        <div className="scale__thumb" ref={thumb}>
          <span className="scale__readout mono" ref={readout}>000</span>
          <span className="scale__current">{markers[active]?.label}</span>
        </div>
      </div>

      {/* Section markers double as navigation; labels reveal on hover/focus. */}
      <ol className="scale__markers">
        {markers.map((m, i) => (
          <li key={m.label + i} style={{ top: `${m.at * 100}%` }}>
            <button className={i === active ? 'is-active' : ''} onClick={() => scrollToY(m.top)}>
              <span className="scale__mlabel">
                <em>{String(i + 1).padStart(2, '0')}</em>
                {m.label}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </aside>
  );
}
