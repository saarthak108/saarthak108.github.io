import type { CSSProperties } from 'react';
import { src, srcSet, type ImageAsset, type ImageSize } from '../data/images';

type Props = {
  img: ImageAsset;
  /** Force a crop ratio (e.g. "4/5"). Defaults to the image's natural ratio. */
  ratio?: string;
  size?: ImageSize;
  sizes?: string;
  /** Parallax travel in % (inner image is oversized to allow movement). */
  parallax?: number;
  eager?: boolean;
  className?: string;
  /** Zoom into the focal point — used for "detail" crops of a single render. */
  zoom?: number;
  focus?: string;
};

/** A render in a fixed-ratio frame. Placeholders render a drafting-style frame instead of a file. */
export function Render({ img, ratio, size = 'md', sizes = '(max-width: 760px) 100vw, 60vw', parallax, eager, className = '', zoom, focus }: Props) {
  const style = { aspectRatio: ratio ?? `${img.width} / ${img.height}` } as CSSProperties;
  const position = focus ?? img.focus ?? '50% 50%';

  if (img.placeholder) {
    return (
      <div className={`render render--placeholder ${className}`} style={style} role="img" aria-label={img.alt}>
        <svg className="render__grid" viewBox="0 0 160 90" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 0L160 90M160 0L0 90" />
          <rect x="0.5" y="0.5" width="159" height="89" />
          <path d="M20 70 L60 40 L100 52 L140 22" />
        </svg>
        <span className="render__ph-label">Placeholder render · replace in src/data/images.ts</span>
      </div>
    );
  }

  const imgStyle: CSSProperties = { objectPosition: position };
  if (zoom) Object.assign(imgStyle, { transform: `scale(${zoom})`, transformOrigin: position });

  return (
    <div className={`render ${className}`} style={style}>
      <div className="render__inner" data-parallax={parallax} style={parallax ? { inset: `-${parallax}% 0` } : undefined}>
        <img
          src={src(img, size)}
          srcSet={srcSet(img)}
          sizes={sizes}
          alt={img.alt}
          width={img.width}
          height={img.height}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          style={imgStyle}
        />
      </div>
    </div>
  );
}
