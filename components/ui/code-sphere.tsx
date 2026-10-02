"use client";
// Interactive code sphere. Inspired by Framer's ParticlesSphere, rebuilt on a 2D canvas:
// the "particles" are code glyphs (0/1, brackets, tags, hex, WEB / AI / CMS ...).
//  - idle: slow rotation + per-glyph organic drift and breathing
//  - cursor: a repulsion field scatters nearby glyphs outward; they spring back when it leaves
//  - whole sphere tilts a little toward the cursor
// Glyphs are pre-rendered to sprites once, so each frame is only drawImage calls.
// Pauses offscreen / in background tabs. Lighter on tablets and phones. Static for reduced motion.
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const TOKENS = [
  // weighted toward binary so the sphere reads as "data" first
  "0", "1", "0", "1", "0", "1", "0", "1", "01", "10", "101", "010", "0101", "1010",
  "{", "}", "{ }", "</>", "/>", "<a>", "<h1>", "<div>", "//", "=>", "()", "[ ]", ";", "&&", "===",
  "0x1F", "0xA3", "0x7D", "#19C37D", "404", "200", "200 OK", "px", "rem", "flex", "grid", ":root",
  "const", "let", "async", "fn", "npm", "git",
  "WEB", "AI", "CMS", "UI", "DEV", "SEO", "API", "UX",
];

// brand palette, weighted: mostly muted gray, some off white, a little mint and green
const COLORS = [
  { c: "#89938d", w: 0.52 },
  { c: "#f5f7f6", w: 0.26 },
  { c: "#8be5bd", w: 0.13 },
  { c: "#19c37d", w: 0.09 },
];

type Glyph = {
  ux: number; uy: number; uz: number; // home direction on the unit sphere
  sprite: number;
  phase: number; drift: number; breathe: number;
  ox: number; oy: number; vx: number; vy: number; // scatter offset (screen px) + velocity
};

function pickColor(r: number) {
  let acc = 0;
  for (let i = 0; i < COLORS.length; i++) {
    acc += COLORS[i].w;
    if (r <= acc) return i;
  }
  return 0;
}

export function CodeSphere({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const font = probeRef.current ? getComputedStyle(probeRef.current).fontFamily : "monospace";

    let W = 0, H = 0, R = 0, dpr = 1;
    let glyphs: Glyph[] = [];
    let sprites: { img: HTMLCanvasElement; w: number; h: number }[] = [];
    const order: number[] = [];
    const proj = new Float32Array(0);
    let px = proj, py = proj, pz = proj;

    const build = () => {
      const w = wrap.clientWidth;
      const count = w < 420 || coarse ? 170 : w < 520 ? 260 : 380;

      // sprites: one per token × color, drawn once at device resolution
      sprites = [];
      const fontPx = 13 * dpr;
      const spriteIndex = new Map<string, number>();
      const m = document.createElement("canvas").getContext("2d")!;
      m.font = `500 ${fontPx}px ${font}`;
      const spriteFor = (token: string, colorIdx: number) => {
        const key = token + "|" + colorIdx;
        const hit = spriteIndex.get(key);
        if (hit !== undefined) return hit;
        const tw = Math.ceil(m.measureText(token).width) + 4;
        const th = Math.ceil(fontPx * 1.4);
        const c = document.createElement("canvas");
        c.width = tw;
        c.height = th;
        const g = c.getContext("2d")!;
        g.font = `500 ${fontPx}px ${font}`;
        g.textBaseline = "middle";
        g.fillStyle = COLORS[colorIdx].c;
        g.fillText(token, 2, th / 2);
        sprites.push({ img: c, w: tw, h: th });
        spriteIndex.set(key, sprites.length - 1);
        return sprites.length - 1;
      };

      // Fibonacci sphere for an even spread
      glyphs = [];
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const th = golden * i;
        const token = TOKENS[(Math.random() * TOKENS.length) | 0];
        glyphs.push({
          ux: Math.cos(th) * r,
          uy: y,
          uz: Math.sin(th) * r,
          sprite: spriteFor(token, pickColor(Math.random())),
          phase: Math.random() * Math.PI * 2,
          drift: 0.25 + Math.random() * 0.5,
          breathe: 0.4 + Math.random() * 0.8,
          ox: 0, oy: 0, vx: 0, vy: 0,
        });
      }
      order.length = 0;
      for (let i = 0; i < count; i++) order.push(i);
      px = new Float32Array(count);
      py = new Float32Array(count);
      pz = new Float32Array(count);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      R = Math.min(W, H) * 0.39;
      build();
      if (reduce) draw(0);
    };

    // ---- pointer state -------------------------------------------------
    const cursor = { x: 0, y: 0, active: false };
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };

    const onWindowMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      // sphere leans toward the cursor while it is anywhere near the hero
      const nx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
      const ny = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
      tilt.tx = Math.max(-1, Math.min(1, nx)) * 0.35;
      tilt.ty = Math.max(-1, Math.min(1, ny)) * 0.25;
    };
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      cursor.x = e.clientX - r.left;
      cursor.y = e.clientY - r.top;
      cursor.active = true;
    };
    const onLeave = () => {
      cursor.active = false;
    };
    const onUp = (e: PointerEvent) => e.pointerType === "touch" && onLeave();

    // ---- render ---------------------------------------------------------
    const FOCAL = 3.2; // perspective, in sphere radii
    const draw = (t: number, dt = 1 / 60) => {
      const steps = Math.max(1, Math.min(4, Math.round(dt * 60))); // time based, stable on slow frames
      const cx = W / 2, cy = H / 2;
      const rot = t * 0.11 + tilt.x; // slow spin + lean
      const tiltX = -0.32 + tilt.y + Math.sin(t * 0.13) * 0.05;
      const cosX = Math.cos(tiltX), sinX = Math.sin(tiltX);
      const repelR = R * 0.8;

      for (let i = 0; i < glyphs.length; i++) {
        const g = glyphs[i];
        // organic drift: each glyph wanders a little around its home longitude
        const a = rot + Math.sin(t * g.drift + g.phase) * 0.06;
        const ca = Math.cos(a), sa = Math.sin(a);
        const rad = R * (1 + Math.sin(t * g.breathe + g.phase) * 0.03);
        let x = (g.ux * ca + g.uz * sa) * rad;
        let z = (-g.ux * sa + g.uz * ca) * rad;
        let y = g.uy * rad;
        const y2 = y * cosX - z * sinX;
        z = y * sinX + z * cosX;
        y = y2;
        const s = FOCAL / (FOCAL - z / R);
        x = cx + x * s;
        y = cy + y * s;

        // repulsion field: stronger closer to the cursor, pushes outward (+ a little swirl)
        let tx = 0, ty = 0;
        if (cursor.active && !reduce) {
          const dx = x - cursor.x, dy = y - cursor.y;
          const d = Math.hypot(dx, dy);
          if (d < repelR && d > 0.001) {
            // falloff: strong near the cursor, fading to nothing at the edge of the field
            const f = Math.pow(1 - d / repelR, 1.6) * R * 0.75 * (0.55 + 0.45 * ((z / R + 1) / 2));
            const nx = dx / d, ny = dy / d;
            tx = nx * f - ny * f * 0.25;
            ty = ny * f + nx * f * 0.25;
          }
        }
        // spring back home (slightly underdamped, never snaps)
        for (let k = 0; k < steps; k++) {
          g.vx = (g.vx + (tx - g.ox) * 0.07) * 0.84;
          g.vy = (g.vy + (ty - g.oy) * 0.07) * 0.84;
          g.ox += g.vx;
          g.oy += g.vy;
        }

        px[i] = x + g.ox;
        py[i] = y + g.oy;
        pz[i] = z;
      }

      order.sort((a, b) => pz[a] - pz[b]); // back to front
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      for (const i of order) {
        const depth = (pz[i] / R + 1) / 2; // 0 back, 1 front
        const sp = sprites[glyphs[i].sprite];
        const scale = (0.55 + depth * 0.6) / dpr;
        const w = sp.w * scale, h = sp.h * scale;
        ctx.globalAlpha = 0.1 + Math.pow(depth, 1.6) * 0.9;
        ctx.drawImage(sp.img, px[i] - w / 2, py[i] - h / 2, w, h);
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    let running = false;
    let t = 0;
    let last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      const k = 1 - Math.pow(0.95, dt * 60);
      tilt.x += (tilt.tx - tilt.x) * k;
      tilt.y += (tilt.ty - tilt.y) * k;
      draw(t, dt);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: "80px" });
    const onVis = () => (document.hidden ? stop() : start());

    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      resize();
      ro.observe(wrap);
      io.observe(wrap);
    });
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerdown", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointercancel", onLeave);
    wrap.addEventListener("pointerup", onUp);
    if (!coarse && !reduce) window.addEventListener("pointermove", onWindowMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerdown", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointercancel", onLeave);
      wrap.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointermove", onWindowMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div ref={wrapRef} className={cn("relative", className)} style={{ touchAction: "pan-y" }} aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <span ref={probeRef} className="pointer-events-none absolute font-mono opacity-0">
        0
      </span>
    </div>
  );
}

export default CodeSphere;
