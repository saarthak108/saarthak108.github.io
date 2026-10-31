// All personal / professional facts, extracted from the original portfolio.
// Nothing here is invented; fields marked `pending` are shown as editable placeholders.

export const identity = {
  name: 'Saarthak Maharana',
  first: 'Saarthak',
  last: 'Maharana',
  role: '3D Environment & ArchViz Artist',
  roles: ['Game Environment Artist', 'ArchViz Artist'],
  location: 'Delhi, India',
  tagline: 'Crafting worlds beyond imagination.',
  email: 'saarthakmaharana108@gmail.com',
};

export const bio = {
  lead: 'I’m a 3D environment artist from Delhi, India, crafting immersive worlds for games, cinematics, virtual experiences and architecture.',
  paragraphs: [
    'I take on full environment builds — from blockout and kit creation to lighting, dressing and final optimization — in Unreal Engine 5 and Blender.',
    'My practice is focused on solving real-world production challenges with thoughtful world-building. Whether you need a hero environment for a trailer, a fully playable game level, or a stylized diorama, my approach brings atmosphere, storytelling and technical polish together for studios across genres.',
  ],
};

export const principles = [
  {
    title: 'Rapid World Building',
    body: 'From rough blockout to a fully dressed and lit scene on tight timelines — without ever cutting corners.',
  },
  {
    title: 'Precision & Aesthetics',
    body: 'Composition, lighting and material fidelity crafted down to the last texel — every frame built to hold up as a still.',
  },
  {
    title: 'Performance-Ready Worlds',
    body: 'Optimized geometry, LODs and real-time budgets, so your world runs as beautifully as it looks — in-engine and in-game.',
  },
];

export const aiWorkflow = {
  title: 'Also fluent in ComfyUI',
  body: 'Alongside real-time engines, I build custom node-based diffusion pipelines in ComfyUI — using them in ArchViz projects to enhance architecture renders: refining light, materials and atmosphere while keeping full artistic control over the final frame.',
};

export type TimelineEntry = {
  org: string;
  role?: string;
  period: string;
  start: string;
  detail?: string;
  current?: boolean;
  pending?: string;
};

export const experience: TimelineEntry[] = [
  {
    org: 'Altrune Studio',
    period: 'Oct 2025 — Present',
    start: '2025',
    current: true,
    pending: 'Role title and responsibilities — add in src/data/profile.ts',
  },
  {
    org: 'Freelance',
    role: '3D Environments & ArchViz',
    period: '2024 — 2025',
    start: '2024',
    detail: 'Independent environment and architectural visualization work for clients.',
  },
];

export const education: TimelineEntry[] = [
  { org: 'BBA', role: 'Graduation', period: 'Completed 2023', start: '2023' },
  { org: 'ADVFX Plus — MAAC Institute', role: '3D & VFX Software', period: '2020 — 2023', start: '2020' },
];

export type Achievement = {
  title: string;
  issuer: string;
  year?: string;
  kind: 'Award' | 'Certification';
  detail?: string;
  /** Link to the awarded film (opens in a new tab). */
  href?: string;
  /** Certificate image in public/certificates/ (shown as a thumbnail that opens full size). */
  certificate?: string;
};

export const achievements: Achievement[] = [
  {
    title: '2× Gold — “Dekho India Dekho”',
    issuer: 'Delhi CG Animation Awards',
    year: '2023',
    kind: 'Award',
    detail: 'Best 3D Short Film · Best Lighting / Compositing',
    href: 'https://www.youtube.com/watch?v=WWte9g75Rr8',
  },
  {
    title: 'Bronze — Brew Coffee Ad',
    issuer: 'Delhi CG Animation Awards',
    year: '2022',
    kind: 'Award',
    href: 'https://www.youtube.com/watch?v=SL4Vw-ZquCc',
  },
  { title: 'Adobe Certified Professional', issuer: 'Adobe', kind: 'Certification', certificate: 'adobe-certified-professional' },
  { title: 'Autodesk Certified User', issuer: 'Autodesk', kind: 'Certification', certificate: 'autodesk-certified-user' },
];

export type Tool = { name: string; group: string; brief: string; note?: string; usedIn?: string[] };

export const toolGroups = [
  { id: 'realtime', label: 'Real-time & Engines' },
  { id: 'modeling', label: 'Modeling & CAD' },
  { id: 'terrain', label: 'Terrain & Vegetation' },
  { id: 'render', label: 'Rendering' },
  { id: 'post', label: 'Post & Motion' },
  { id: 'ai', label: 'AI Workflow' },
] as const;

// In order of how much they're used — main tools first.
export const tools: Tool[] = [
  { name: 'Unreal Engine', group: 'realtime', note: 'Lumen · Nanite · Sequencer', usedIn: ['valley-of-aldrheim', 'the-nuclear-plant', 'medieval-castle'],
    brief: 'Epic Games’ real-time engine and my main tool. Used to build, dress and light full environments — Lumen for real-time global illumination, Nanite for film-quality geometry, and Sequencer to direct the cinematics.' },
  { name: 'Blender', group: 'modeling', usedIn: ['the-silent-observer', 'porsche-gt4-rs', 'hidden-temple-of-ganesha'],
    brief: 'Open-source 3D suite for modeling, sculpting, UVs and rendering. Used for hero assets, hard-surface and organic modeling, and Cycles renders for stills and product-style films.' },
  { name: 'D5 Render', group: 'render',
    brief: 'Real-time ray-traced renderer made for architecture. Used to turn architects’ models into photoreal ArchViz stills and walkthroughs quickly, with fast lighting and material iteration.' },
  { name: 'SketchUp', group: 'modeling',
    brief: 'Fast, intuitive architectural modeling tool — and a common format architects share models in. Used to model, import and clean up building geometry for visualization.' },
  { name: 'ComfyUI', group: 'ai', note: 'Diffusion pipelines for ArchViz',
    brief: 'Node-based interface for building AI image pipelines (Stable Diffusion). Used to enhance ArchViz renders — refining light, materials and atmosphere — while keeping full artistic control.' },
  { name: 'Rhino 3D', group: 'modeling',
    brief: 'Precision NURBS modeler used by architects and designers. Used for complex, curved and parametric forms that need accurate geometry.' },
  { name: '3ds Max', group: 'modeling',
    brief: 'Autodesk’s 3D modeling and rendering software, an industry standard in architectural visualization. Used for modeling and preparing scenes.' },
  { name: 'Gaea', group: 'terrain',
    brief: 'Procedural terrain generator. Used to create realistic mountains and landscapes with natural erosion, exported as heightmaps and masks into Unreal Engine.' },
  { name: 'World Creator', group: 'terrain',
    brief: 'Real-time terrain and landscape generator. Used to shape and texture large-scale terrain quickly for open environments.' },
  { name: 'SpeedTree', group: 'terrain',
    brief: 'Industry-standard vegetation software. Used to create trees and foliage that are detailed up close yet optimized for real-time scenes.' },
  { name: 'Photoshop', group: 'post',
    brief: 'Adobe’s image editor. Used for textures, paint-overs, compositing and final colour grading of stills.' },
  { name: 'Premiere Pro', group: 'post',
    brief: 'Adobe’s video editor. Used to cut cinematics and showreels, add sound and deliver the final films.' },
  { name: 'After Effects', group: 'post',
    brief: 'Adobe’s motion graphics and compositing tool. Used for titles, visual effects and finishing touches on films.' },
];

/** Also mentioned in the original portfolio as part of the pipeline. */
export const pipeline = ['Substance 3D', 'Quixel Megascans', 'PBR workflows', 'Consistent texel density'];

export const services = [
  { title: '3D Environment Art', items: ['Unreal Engine 5 Scenes', 'World Building', 'Set Dressing', 'Level Art'] },
  { title: 'Game-Ready Worlds', items: ['Optimization', 'LODs & Culling', 'Collisions', 'Playable Maps'] },
  { title: 'Modeling & Texturing', items: ['Hard Surface', 'Sculpting', 'Retopology', 'PBR Materials'] },
  { title: 'Lighting & Rendering', items: ['Lumen & GI', 'Path Tracing', 'Color Grading', 'Post-Processing'] },
  { title: 'Cinematics & Reels', items: ['UE5 Sequencer', 'Camera Direction', 'Environment Reels', 'Video Editing'] },
];

export const faq = [
  {
    q: 'What kind of projects do you take on?',
    a: 'Full environment builds for games, cinematics, virtual experiences and architecture — from blockout and kit creation to lighting, dressing and final optimization, in Unreal Engine 5 and Blender.',
  },
  {
    q: 'How long does a complete environment take?',
    a: 'A focused diorama or single hero scene usually ships in one to two weeks. Larger playable levels with custom kits, LODs and optimization typically run three to six weeks, depending on scope, assets and feedback rounds.',
  },
  {
    q: 'Do you deliver game-ready, optimized environments?',
    a: 'Yes — every scene follows real-time budgets: modular kits, trimmed draw calls, LODs, collision setup and in-engine profiling, so the world runs as smoothly on target hardware as it looks in screenshots.',
  },
  {
    q: 'What tools and standards do you work with?',
    a: 'Unreal Engine 5 (Lumen, Nanite, Sequencer), Blender, Substance 3D, Quixel Megascans and Adobe Premiere Pro — following PBR workflows, consistent texel density and clean, documented project structures your team can pick up instantly.',
  },
  {
    q: 'How do we start working together?',
    a: 'Send a brief — or even a rough idea. I’ll reply with a plan, timeline and quote within 48 hours, then we move from blockout to final world in clear weekly milestones.',
  },
];

export const socials = [
  { label: 'ArtStation', handle: 'artstation.com/saarthak_108', href: 'https://www.artstation.com/saarthak_108' },
  { label: 'LinkedIn', handle: 'linkedin.com/in/saarthak108', href: 'https://www.linkedin.com/in/saarthak108/' },
  { label: 'YouTube', handle: 'youtube.com/@saarthak_108', href: 'https://www.youtube.com/@saarthak_108' },
];

export const nav = [
  { to: '/work', label: 'Work' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/experience', label: 'Experience' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/skills', label: 'Skills' },
];
