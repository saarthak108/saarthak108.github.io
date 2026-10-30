import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { src, type ImageAsset } from '../data/images';
import { formatDuration, type Project, type Video } from '../data/projects';
import { setScrollLocked } from '../lib/motion';

export type LightboxItem = {
  img: ImageAsset;
  video?: Video;
  project: Project;
  /** Position of this view within its own project, e.g. render 3 of 9. */
  part?: [number, number];
};

/** Flattens projects into lightbox views (video first, then every still) plus each project's first index. */
export function lightboxItems(list: Project[]) {
  const items: LightboxItem[] = [];
  const start: Record<string, number> = {};
  for (const p of list) {
    start[p.slug] = items.length;
    const views: Omit<LightboxItem, 'project' | 'part'>[] = [
      ...(p.video ? [{ img: p.video.poster, video: p.video }] : []),
      ...p.renders.map((img) => ({ img })),
    ];
    views.forEach((v, i) => items.push({ ...v, project: p, part: views.length > 1 ? [i + 1, views.length] : undefined }));
  }
  return { items, start };
}

type Props = {
  items: LightboxItem[];
  index: number | null;
  onChange: (i: number) => void;
  onClose: () => void;
  /** Show a thumbnail strip (used when cycling one project's renders). */
  thumbs?: boolean;
};

const pad = (n: number) => String(n).padStart(2, '0');

export function Lightbox({ items, index, onChange, onClose, thumbs }: Props) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touchX = useRef(0);
  const open = index !== null;
  const many = items.length > 1;
  const go = (d: number) => onChange((index! + d + items.length) % items.length);

  useEffect(() => {
    if (!open) return;
    setScrollLocked(true);
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (!many) return;
      if (e.key === 'ArrowRight') onChange((index! + 1) % items.length);
      if (e.key === 'ArrowLeft') onChange((index! - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      setScrollLocked(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, index, items.length, many, onChange, onClose]);

  if (!open) return null;
  const { img, video, project: p, part } = items[index];
  const meta = [
    ['Studio', p.studio],
    ['Location', p.location],
    ['Year', p.year],
    ['Software', p.software],
    ['Length', video && formatDuration(video.duration)],
  ].filter(([, v]) => v) as [string, string][];

  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={p.title} onClick={onClose}>
      <div
        className="lightbox__stage"
        // Swipe left / right on touch screens.
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (many && Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }}
      >
        <div className="lightbox__media" onClick={(e) => e.stopPropagation()}>
          {video ? (
            <video key={video.src} src={video.src} poster={src(video.poster, 'lg')} controls autoPlay playsInline />
          ) : (
            <img key={img.key} src={src(img, 'lg')} alt={img.alt} />
          )}
        </div>
        {many && (
          <>
            <button className="lightbox__nav lightbox__nav--prev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); go(-1); }}>←</button>
            <button className="lightbox__nav lightbox__nav--next" aria-label="Next" onClick={(e) => { e.stopPropagation(); go(1); }}>→</button>
          </>
        )}
      </div>

      <aside className="lightbox__info" onClick={(e) => e.stopPropagation()}>
        <p className="mono label lightbox__count">
          {many ? `${pad(index + 1)} / ${pad(items.length)}` : p.category}
          {part && part[1] !== items.length && <span className="dim"> · {video ? 'Film' : `View ${part[0]} of ${part[1]}`}</span>}
        </p>
        <h2 className="lightbox__title display">{p.title}</h2>
        {many && <p className="mono dim lightbox__cat">{p.category}</p>}
        {p.summary && <p className="lightbox__lede">{p.summary}</p>}
        {p.description.map((d) => <p key={d} className="lightbox__desc">{d}</p>)}
        {meta.length > 0 && (
          <dl className="lightbox__meta mono">
            {meta.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        )}
        {p.section !== 'practice' && (
          <Link to={`/work/${p.slug}`} className="link-arrow mono" onClick={onClose}>Project page →</Link>
        )}
        {thumbs && many && (
          <div className="lightbox__thumbs">
            {items.map((it, i) => (
              <button key={it.img.key} className={i === index ? 'is-active' : ''} aria-label={`View ${i + 1}`} aria-current={i === index} onClick={() => onChange(i)}>
                <img src={src(it.img, 'sm')} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </aside>

      <button ref={closeBtn} className="lightbox__close mono" onClick={onClose}>Close ✕</button>
    </div>,
    document.body,
  );
}
