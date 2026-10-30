# Saarthak Maharana — Portfolio

A single-page, scroll-driven portfolio for **Saarthak Maharana**, 3D Game Environment & ArchViz Artist (Delhi, India). Layout and motion are a faithful recreation of the Elena Voss reference template, rebranded and restructured to Saarthak's spec.

## Run it

Any static server works:

```bash
cd portfolio
python3 -m http.server 8000
# open http://localhost:8000
```

## Stack

- Vanilla HTML/CSS/JS — no build step.
- [GSAP 3.13](https://gsap.com) + ScrollTrigger + SplitText (vendored in `assets/`).
- [Lenis](https://lenis.darkroom.engineering/) smooth scroll (vendored).
- Host Grotesk font, vendored as woff2 (we throw weights 300–600).

## Structure (index.html, top → bottom)

1. **Header** — "SM." logo + "Get in Touch" pill (scrolls to footer form).
2. **Hero** (300vh sticky) — big type "Visualise Your Mind in Motion", right column "Immersive 3D Environments" / "Game Environment Artist & ArchViz Artist", waist-up portrait (`img/hero-male.png`), then the dark marquee overlay.
3. **Featured Projects** — pinned portfolio with progress line + crossfading ArtStation covers.
4. **Why Work With Me?** — 3 cards.
5. **Services** — pinned horizontal scroll, 5 dark cards.
6. **Milestones** — two columns. Left: Education (Kendriya Vidyalaya, ADVFX Plus @ MAAC, BBA, Freelancing) then Work Experience (Altrune Studio). Right: Achievements — each with a circular **link button (`href="#"` placeholder)** for future certificate/awarded-work URLs. String-line separators keep the guitar-string hover bend; there is intentionally **no hover image preview** (removed with the floating image container).
7. **Toolkit** — 12 wordmarks on a 4×3 perspective-flip grid: Unreal Engine, Blender, 3Ds Max, SpeedTree, SketchUp, D5 Render, Photoshop, Premiere Pro, After Effects, Gaea, Rhino 3D, World Creator.
8. **AI Workflow** — new block: ComfyUI diffusion pipelines for enhancing ArchViz renders.
9. **FAQ** — 6 questions.
10. **Footer / Get in Touch** — SM. logo, working contact form (below), Reach-Out links, socials (ArtStation, LinkedIn, YouTube), copyright.

## Contact form (IMPORTANT — one-time activation)

The footer form posts to [FormSubmit](https://formsubmit.co)'s AJAX endpoint:

```
https://formsubmit.co/ajax/saarthakmaharana108@gmail.com
```

- **The very first submission triggers a one-time activation email** from FormSubmit to `saarthakmaharana108@gmail.com` — Saarthak must click **"Activate"** in that email once; after that, all subsequent form messages arrive in his inbox directly.
- Sends `_subject`, `_template: table`, `_captcha: false` (honeypot-free for simplicity; add `_honey` later if spam appears).
- Failure state tells the visitor to email the address directly.

## Placeholders to fill in later

| What | Where |
|---|---|
| Achievement certificate/awarded-work links | `index.html` — the 4 `<a class="ach-link" href="#">` in the Milestones right column |
| Real social URLs | footer `.soc` anchors (YouTube is currently `#`) |
| Portrait | `img/hero-male.png` is the outpainted cutout of the real portrait; swap anytime with an equal-aspect PNG |
| Contact details | footer "Reach Out" list |

## Folders

- `img/` — live site images (`hero-male.png`, 8 `work-*.jpg` project covers, `footer-bg.svg`).
- `img-src/` — originals/working files: `hero-original-upload.png` (user's upload), `hero-real-full.jpg` (AI outpainted waist-up source), `hero-male-placeholder-bak.png` (old placeholder backup).
- `assets/` — vendored JS libs + fonts (no CDN dependency).
- `js/main.js` — all animation/contact-form logic.
- `css/style.css` — all styles.
