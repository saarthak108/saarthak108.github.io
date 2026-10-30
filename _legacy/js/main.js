/* ==========================================================================
   Saarthak Maharana — Portfolio interactions
   GSAP 3.13 + ScrollTrigger + SplitText + Lenis
   ========================================================================== */

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ---------------------------------------------------------------- Lenis */
const lenis = new Lenis({
  duration: 1.15,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

const isFine = window.matchMedia('(pointer: fine)').matches;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* -------------------------------------------------- instant hide helpers */
gsap.set('#header', { y: -30, autoAlpha: 0 });
gsap.set('[data-intro]', { autoAlpha: 0 });
gsap.set('.hero-av', { autoAlpha: 0 });

/* -------------------------------------------------- masked line splits */
function splitLines(el) {
  const split = new SplitText(el, { type: 'lines' });
  split.lines.forEach((line) => {
    const mask = document.createElement('div');
    mask.className = 'split-mask';
    line.parentNode.insertBefore(mask, line);
    mask.appendChild(line);
  });
  return split.lines;
}

/* ============================================================ HERO INTRO */
function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  // headline lines
  const h1Lines = splitLines('.hero-title-col h1');
  const sideLines = splitLines('.hero-side-col p');

  gsap.set([h1Lines, sideLines], { yPercent: 115 });
  gsap.set('[data-intro]', { autoAlpha: 1 });
  gsap.set('.hero-av', { autoAlpha: 1 });

  tl.to('.hero-av', {
    clipPath: 'inset(0% 0% 0% 0%)', duration: 1.7, ease: 'expo.inOut',
  }, 0.1)
    .fromTo('.hero-av img', { scale: 1.35 }, { scale: 1, duration: 1.7, ease: 'expo.inOut' }, 0.1)
    .to(h1Lines, { yPercent: 0, duration: 1.25, stagger: 0.09 }, 0.55)
    .to(sideLines, { yPercent: 0, duration: 1, stagger: 0.07 }, 0.9)
    .to('#header', { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out' }, 1.1);

  gsap.set('.hero-av', { clipPath: 'inset(100% 0% 0% 0%)' });
  tl.play(0);
}

/* -------------------------------------------------- hero intro kick-off */
gsap.set('.hero-av', { clipPath: 'inset(100% 0% 0% 0%)' });
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => requestAnimationFrame(heroIntro));
} else {
  window.addEventListener('load', heroIntro);
}

/* ======================================================== HERO SCROLL */
const heroTl = gsap.timeline({
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6,
  },
});
heroTl
  .to('.hero-inner', { yPercent: -28, autoAlpha: 0, ease: 'none', duration: 0.32 }, 0)
  .to('.hero-av', { yPercent: -10, ease: 'none', duration: 0.45 }, 0)
  .fromTo('.hero-pin',
    { clipPath: 'circle(135% at 50% 36%)' },
    { clipPath: 'circle(0% at 50% 36%)', ease: 'power1.in', duration: 0.62 }, 0.26)
  .fromTo('.hero-marquee-pin',
    { scale: 1.14, autoAlpha: 0.55 },
    { scale: 1, autoAlpha: 1, ease: 'power1.out', duration: 0.62 }, 0.3)
  .to({}, { duration: 0.12 });

/* ------------------------------------------------------- header blur */
ScrollTrigger.create({
  start: () => window.innerHeight * 0.55,
  end: 'max',
  onToggle: (s) => document.getElementById('header').classList.toggle('is-blurred', s.isActive),
});

/* ==================================================== GENERIC COPIES */
function initCopies() {
  gsap.utils.toArray('[data-copy]').forEach((el) => {
    const lines = splitLines(el);
    gsap.set(lines, { yPercent: 115 });
    gsap.to(lines, {
      yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => requestAnimationFrame(initCopies));
} else {
  window.addEventListener('load', initCopies);
}

/* ==================================================== FEATURED WORKS */
// decorative orange bloom over the marquee
gsap.fromTo('.pf-clip',
  { clipPath: 'circle(0% at 50% -10%)' },
  {
    clipPath: 'circle(160% at 50% -10%)', ease: 'power1.inOut',
    scrollTrigger: { trigger: '#portfolio', start: 'top bottom', end: 'top 15%', scrub: true },
  });

const pfItems = gsap.utils.toArray('.pf-item');
const pfFrames = gsap.utils.toArray('.pf-frame');
let pfActive = -1;

function setPf(idx) {
  if (idx === pfActive) return;
  pfActive = idx;
  pfItems.forEach((it, i) => it.classList.toggle('is-active', i === idx));
  pfFrames.forEach((fr, i) => {
    gsap.to(fr, { autoAlpha: i === idx ? 1 : 0, duration: 0.35, ease: 'power2.out', overwrite: true });
    if (i === idx) gsap.fromTo(fr.querySelector('img'), { scale: 1.08 }, { scale: 1, duration: 0.9, ease: 'power2.out', overwrite: true });
  });
}
gsap.set(pfFrames, { autoAlpha: 0 });
setPf(0);

ScrollTrigger.create({
  trigger: '#portfolio',
  start: 'top top',
  end: 'bottom bottom',
  scrub: true,
  onUpdate: (self) => {
    gsap.set('.pf-line-progress', { scaleY: self.progress });
    setPf(Math.min(pfItems.length - 1, Math.floor(self.progress * pfItems.length)));
  },
});

gsap.from('.pf-title', { y: 60, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '#portfolio', start: 'top 40%', once: true } });

/* ==================================================== WHY WORK WITH ME */
gsap.from('.work-card', {
  y: 70, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: 0.14,
  scrollTrigger: { trigger: '.ww-grid', start: 'top 82%', once: true },
});
gsap.to('.work-line span', {
  scaleX: 1, duration: 1.3, ease: 'expo.out', stagger: 0.14,
  scrollTrigger: { trigger: '.ww-grid', start: 'top 70%', once: true },
});

/* ========================================================= SERVICES */
const servicesSection = document.getElementById('services');
const servicesRow = document.querySelector('.services-row');
const servicesPin = document.querySelector('.services-pin');

function servicesMetrics() {
  const padX = parseFloat(getComputedStyle(servicesRow).paddingLeft) || 0;
  return servicesRow.scrollWidth - window.innerWidth + padX;
}
function sizeServices() {
  servicesSection.style.height = '';
  const headerH = servicesPin.offsetTop;
  const dist = servicesMetrics();
  servicesSection.style.height = `${headerH + window.innerHeight + dist}px`;
}
sizeServices();
ScrollTrigger.addEventListener('refreshInit', sizeServices);
gsap.to(servicesRow, {
  x: () => -servicesMetrics(),
  ease: 'none',
  scrollTrigger: {
    trigger: '#services',
    start: () => `top+=${servicesPin.offsetTop} top`,
    end: () => `+=${servicesMetrics()}`,
    scrub: 1,
    invalidateOnRefresh: true,
  },
});

gsap.from('.services-card', {
  y: 90, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1,
  scrollTrigger: { trigger: '.services-pin', start: 'top 75%', once: true },
});

// radial gradient fill follows the cursor
gsap.utils.toArray('.services-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  });
});

/* ========================================================== AWARDS */
gsap.from('.award-row', {
  y: 50, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.08,
  scrollTrigger: { trigger: '.awards-cols', start: 'top 80%', once: true },
});
gsap.from('.acol-head', {
  y: 30, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1,
  scrollTrigger: { trigger: '.awards-cols', start: 'top 82%', once: true },
});

// guitar-string dividers
gsap.utils.toArray('.string-line').forEach((line) => {
  const svg = line.querySelector('svg');
  const path = svg.querySelector('path');
  const state = { bend: 0, bx: 0.5, draw: 0 };
  let w = line.clientWidth || window.innerWidth;

  const render = () => {
    w = line.clientWidth || window.innerWidth;
    const cpX = w * state.bx;
    const cpY = 50 + state.bend;
    path.setAttribute('d', `M0,50 Q${cpX},${cpY} ${w},50`);
  };
  render();

  // draw in
  gsap.to(state, {
    draw: 1, duration: 1.4, ease: 'power3.inOut',
    scrollTrigger: { trigger: line, start: 'top 92%', once: true },
    onUpdate: () => {
      path.style.strokeDasharray = path.getTotalLength();
      path.style.strokeDashoffset = (1 - state.draw) * path.getTotalLength();
    },
    onComplete: () => { path.style.strokeDasharray = 'none'; path.style.strokeDashoffset = 0; },
  });

  if (isFine && !reduced) {
    const bendTo = gsap.quickTo(state, 'bend', { duration: 0.3, ease: 'power2.out' });
    // the interactive hit area is the award row above the string
    const hitArea = line.previousElementSibling || line;
    hitArea.addEventListener('mousemove', (e) => {
      const r = svg.getBoundingClientRect();
      state.bx = gsap.utils.clamp(0.05, 0.95, (e.clientX - r.left) / r.width);
      bendTo(gsap.utils.clamp(-36, 36, (e.clientY - (r.top + r.height / 2)) * 0.8));
    });
    hitArea.addEventListener('mouseleave', () => {
      gsap.to(state, { bend: 0, bx: 0.5, duration: 1.1, ease: 'elastic.out(1.4,0.18)', onUpdate: render });
    });
    gsap.ticker.add(render);
    window.addEventListener('resize', render);
  } else {
    render();
    window.addEventListener('resize', render);
  }
});

/* ======================================================== TOOLKIT */
const cbTl = gsap.timeline({
  scrollTrigger: { trigger: '#clientblur', start: 'top top', end: 'bottom bottom', scrub: 0.5 },
});
cbTl
  .to('.cb-text-w', { filter: 'blur(14px)', autoAlpha: 0, y: -50, duration: 0.3, ease: 'power1.in' }, 0.05)
  .from('.cb-item', {
    rotationX: -72, y: 90, autoAlpha: 0, filter: 'blur(10px)',
    duration: 0.55, ease: 'power2.out',
    stagger: { each: 0.06, grid: [3, 4], from: 'start' },
  }, 0.22);

/* ==================================================== CONTACT FORM */
const gtForm = document.getElementById('gtForm');
if (gtForm) {
  const gtStatus = document.getElementById('gtStatus');
  const gtLabel = document.getElementById('gtSubmitLabel');
  const gtSubmit = document.getElementById('gtSubmit');

  const setStatus = (msg, cls) => {
    gtStatus.textContent = msg;
    gtStatus.className = `gt-status show ${cls}`;
  };

  gtForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = gtForm.name.value.trim();
    const email = gtForm.email.value.trim();
    const message = gtForm.message.value.trim();

    if (!name || !email || !message) {
      setStatus('Please fill in all the fields.', 'err');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('That email doesn\u2019t look right \u2014 mind checking it?', 'err');
      return;
    }

    gtSubmit.disabled = true;
    setStatus('Sending\u2026', '');

    try {
      const res = await fetch('https://formsubmit.co/ajax/saarthakmaharana108@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name, email, message,
          _subject: `Portfolio inquiry \u2014 ${name}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });
      if (!res.ok) throw new Error('send failed');
      gtForm.reset();
      setStatus('Message sent \u2014 I\u2019ll get back to you within 48 hours. \u26A1', 'ok');
    } catch (err) {
      setStatus('Couldn\u2019t send right now \u2014 email me directly at saarthakmaharana108@gmail.com', 'err');
    } finally {
      gtSubmit.disabled = false;
    }
  });
}

/* ============================================================ FAQ */
gsap.utils.toArray('.faq-item').forEach((item, idx) => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  if (!item.classList.contains('is-open')) gsap.set(a, { height: 0 });

  const toggle = () => {
    const isOpen = item.classList.contains('is-open');
    // close others
    gsap.utils.toArray('.faq-item.is-open').forEach((other) => {
      if (other === item) return;
      other.classList.remove('is-open');
      other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      gsap.to(other.querySelector('.faq-a'), { height: 0, duration: 0.45, ease: 'power3.inOut' });
    });
    if (isOpen) {
      item.classList.remove('is-open');
      q.setAttribute('aria-expanded', 'false');
      gsap.to(a, { height: 0, duration: 0.45, ease: 'power3.inOut', onComplete: () => ScrollTrigger.refresh() });
    } else {
      item.classList.add('is-open');
      q.setAttribute('aria-expanded', 'true');
      gsap.set(a, { height: 'auto' });
      gsap.from(a, { height: 0, duration: 0.55, ease: 'power3.inOut', onComplete: () => ScrollTrigger.refresh() });
    }
  };
  q.addEventListener('click', toggle);
  q.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });

  gsap.from(item, {
    y: 40, autoAlpha: 0, duration: 0.9, ease: 'expo.out', delay: idx * 0.07,
    scrollTrigger: { trigger: '.faq-list', start: 'top 82%', once: true },
  });
});

/* ========================================================== FOOTER */
gsap.from('.footer-card', {
  y: 80, autoAlpha: 0, duration: 1.2, ease: 'expo.out',
  scrollTrigger: { trigger: '#footer', start: 'top 75%', once: true },
});
gsap.from('.footer-bar p', {
  y: 20, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
  scrollTrigger: { trigger: '.footer-bar', start: 'top 98%', once: true },
});

/* ================================================== anchor scrolling */
document.querySelectorAll('[data-scroll]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#') && document.querySelector(href)) {
      e.preventDefault();
      lenis.scrollTo(href, { duration: 1.6 });
    }
  });
});
document.querySelector('.logo').addEventListener('click', (e) => {
  e.preventDefault();
  lenis.scrollTo(0, { duration: 1.6 });
});

/* -------------------------------------------------------- final polish */
window.addEventListener('load', () => ScrollTrigger.refresh());
