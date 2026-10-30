import { useEffect, useRef } from 'react';
import { bindMotion } from './motion';

/** Attach to a page root to activate its [data-reveal] and [data-parallax] elements. */
export function useMotion<T extends HTMLElement>(deps: unknown[] = []) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!ref.current) return;
    return bindMotion(ref.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/** Sets the document title for a page. */
export function useTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} — Saarthak Maharana` : 'Saarthak Maharana — 3D Environment & ArchViz Artist';
  }, [title]);
}
