import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouch = () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

let lenis: Lenis | null = null;

/** One Lenis instance for the whole app, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return lenis;
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function scrollToY(y: number, immediate = false) {
  // `force`: scroll even while Lenis is stopped (e.g. the mobile menu was open during navigation).
  if (lenis) lenis.scrollTo(y, { immediate, force: true, duration: 1.4 });
  if (!lenis || immediate) window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
}

export function scrollToEl(el: HTMLElement) {
  scrollToY(el.getBoundingClientRect().top + window.scrollY);
}

export function setScrollLocked(locked: boolean) {
  if (lenis) (locked ? lenis.stop() : lenis.start());
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}

/**
 * Wires the declarative motion attributes inside `root`:
 *  - [data-reveal]      fades/rises in once when entering the viewport (CSS-driven)
 *  - [data-parallax=n]  translates by n% of its height while scrolling through (GSAP scrub)
 * Returns a cleanup function.
 */
export function bindMotion(root: HTMLElement) {
  const reduced = prefersReducedMotion();
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (reduced) el.classList.add('is-in');
    else io.observe(el);
  });

  const ctx = gsap.context(() => {
    if (reduced) return;
    root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      const amount = parseFloat(el.dataset.parallax || '10');
      gsap.fromTo(
        el,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    });
  }, root);

  const refresh = () => ScrollTrigger.refresh();
  const t = window.setTimeout(refresh, 300);
  window.addEventListener('load', refresh);

  return () => {
    io.disconnect();
    ctx.revert();
    window.clearTimeout(t);
    window.removeEventListener('load', refresh);
  };
}

export { gsap, ScrollTrigger };
