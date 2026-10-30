import { useEffect, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { src } from '../data/images';
import { showcase } from '../data/projects';
import { prefersReducedMotion } from '../lib/motion';

type Props = {
  /** The tall scroll section whose progress drives the camera. */
  track: RefObject<HTMLElement>;
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Architectural renders suspended in 3D space. Scroll flies the camera through
 * the field: planes approach, part around the centre, turn like pages and recede.
 * Everything is a pure function of scroll progress, so reversing scroll reverses motion.
 * Writes progress to `--p` on the track so overlay text can animate in CSS.
 */
export function FloatingRenders({ track }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = host.current;
    const trackEl = track.current;
    if (!el || !trackEl) return;

    const mobile = window.innerWidth < 760;
    const reduced = prefersReducedMotion();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(mobile ? 50 : 38, 1, 0.1, 120);
    const world = new THREE.Group();
    scene.add(world);

    // ---- Planes ---------------------------------------------------------
    const COUNT = mobile ? 10 : 18;
    const SPACING = mobile ? 3.8 : 3;
    const RADIUS = mobile ? 1.55 : 3.4;
    const loader = new THREE.TextureLoader();
    const textures = new Map<string, THREE.Texture>();
    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    type Plane = { mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>; x: number; y: number; z: number; rx: number; ry: number; seed: number };
    const planes: Plane[] = [];

    for (let i = 0; i < COUNT; i++) {
      const img = showcase[i % showcase.length];
      const aspect = img.width / img.height;
      const h = aspect < 1 ? (mobile ? 1.7 : 2.7) : mobile ? 1.15 : 1.9;
      const geo = new THREE.PlaneGeometry(h * aspect, h);
      const mat = new THREE.MeshBasicMaterial({ color: 0x1b1d22, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false });

      let tex = textures.get(img.key);
      if (!tex) {
        tex = loader.load(src(img, mobile ? 'sm' : 'md'), (t) => {
          t.needsUpdate = true;
        });
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = Math.min(4, maxAniso);
        textures.set(img.key, tex);
      }
      mat.map = tex;
      mat.color.set(0xffffff);

      const angle = i * 2.399963 + 0.5; // golden angle — even, non-repeating spread
      const r = RADIUS + ((i * 7) % 3) * (mobile ? 0.35 : 0.75);
      const p: Plane = {
        mesh: new THREE.Mesh(geo, mat),
        x: Math.cos(angle) * r * (mobile ? 1 : 1.5),
        y: Math.sin(angle) * r * (mobile ? 1.6 : 0.78),
        z: -3 - i * SPACING,
        rx: Math.sin(i * 1.7) * 0.12,
        ry: Math.cos(i * 1.3) * 0.18,
        seed: i * 0.73,
      };
      planes.push(p);
      world.add(p.mesh);
    }

    // ---- Orbit lines (thin elliptical arcs, echoing an instrument) ------
    const rings: THREE.Line[] = [];
    const ringDefs = [
      { r: mobile ? 3.2 : 6.5, z: -10, color: 0x5b8cff, tilt: 1.2, op: 0.45 },
      { r: mobile ? 4 : 8.5, z: -26, color: 0x9a6bff, tilt: 1.05, op: 0.32 },
      { r: mobile ? 3.4 : 7, z: -44, color: 0xf2f1ee, tilt: 1.3, op: 0.16 },
    ];
    for (const d of ringDefs) {
      const pts = new THREE.EllipseCurve(0, 0, d.r, d.r, 0, Math.PI * 2, false, 0).getPoints(160);
      const geo = new THREE.BufferGeometry().setFromPoints(pts.map((v) => new THREE.Vector3(v.x, v.y, 0)));
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: d.color, transparent: true, opacity: d.op }));
      line.position.z = d.z;
      line.rotation.x = d.tilt;
      line.userData.op = d.op;
      rings.push(line);
      world.add(line);
    }

    const CAM_START = 6;
    const CAM_END = -3 - (COUNT - 1) * SPACING + 10;

    // ---- Sizing / visibility -------------------------------------------
    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    // ---- Loop -----------------------------------------------------------
    const clock = new THREE.Clock();
    let smooth = 0;
    let raf = 0;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      const rect = trackEl.getBoundingClientRect();
      const span = Math.max(1, rect.height - window.innerHeight);
      const target = reduced ? 0 : clamp(-rect.top / span);
      smooth += (target - smooth) * (1 - Math.exp(-dt * 5));
      trackEl.style.setProperty('--p', smooth.toFixed(4));

      if (!visible) return;

      const p = easeInOut(smooth);
      mouse.x += (mouse.tx - mouse.x) * (1 - Math.exp(-dt * 3));
      mouse.y += (mouse.ty - mouse.y) * (1 - Math.exp(-dt * 3));

      camera.position.set(mouse.x * 0.35, -mouse.y * 0.22, CAM_START + (CAM_END - CAM_START) * p);
      camera.lookAt(mouse.x * 0.1, -mouse.y * 0.06, camera.position.z - 10);
      world.rotation.z = p * 0.85 + Math.sin(t * 0.08) * 0.02;

      for (const pl of planes) {
        const dz = camera.position.z - pl.z; // distance in front of the camera
        const near = clamp(1 - dz / 22); // 0 far → 1 at the camera
        const part = 1 + near * near * 0.75; // planes part around the centre as they approach
        const bob = reduced ? 0 : Math.sin(t * 0.5 + pl.seed * 4) * 0.05;
        pl.mesh.position.set(pl.x * part, pl.y * part + bob, pl.z);
        pl.mesh.rotation.set(
          pl.rx + Math.sign(pl.y) * near * 0.35,
          pl.ry - Math.sign(pl.x) * near * 0.75,
          -world.rotation.z * 0.6 + Math.sin(pl.seed) * 0.04,
        );
        const fade = smoothstep(36, 22, dz) * smoothstep(0.4, 2.8, dz);
        pl.mesh.material.opacity = fade;
        pl.mesh.visible = fade > 0.002;
      }

      for (const [i, ring] of rings.entries()) {
        ring.rotation.z = p * (i % 2 ? -1.2 : 1.4) + t * 0.02;
        const dz = camera.position.z - ring.position.z;
        (ring.material as THREE.LineBasicMaterial).opacity = ring.userData.op * smoothstep(48, 30, dz) * smoothstep(0, 6, dz);
      }

      renderer.render(scene, camera);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      planes.forEach((p) => {
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
      });
      rings.forEach((r) => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [track]);

  return (
    <div ref={host} className="floating" aria-hidden="true">
      {failed && (
        <div className="floating__fallback">
          {showcase.slice(0, 6).map((img) => (
            <img key={img.key} src={src(img, 'sm')} alt="" />
          ))}
        </div>
      )}
    </div>
  );
}
