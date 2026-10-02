"use client";
// Background atmosphere: sparse, slow streams of code characters at very low opacity.
// Deliberately NOT a Matrix clone: few columns, short streams, mostly gray, masked away
// from the text. ~30fps, pauses offscreen, a single static frame for reduced motion.
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const CHARS = ["0", "1", "0", "1", "01", "10", "0101", "1010", "{", "}", "<", "/>", "//", "404", "200", "AI", "API", "CMS"];
const COL = 34; // px between columns

type Stream = { x: number; y: number; speed: number; len: number; chars: string[]; alpha: number; green: boolean };

export function DigitalRain({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const font = getComputedStyle(canvas).fontFamily;
    let W = 0, H = 0, dpr = 1;
    let streams: Stream[] = [];
    const LINE = 18;

    const rand = <T,>(a: T[]) => a[(Math.random() * a.length) | 0];
    const spawn = (x: number, anywhere: boolean): Stream => ({
      x,
      y: anywhere ? Math.random() * H : -Math.random() * H * 0.6,
      speed: 10 + Math.random() * 18,
      len: 4 + ((Math.random() * 7) | 0),
      chars: Array.from({ length: 12 }, () => rand(CHARS)),
      alpha: 0.05 + Math.random() * 0.07,
      green: Math.random() < 0.18,
    });

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      streams = [];
      // only ~35% of columns carry a stream, so it reads as texture, not a wall
      for (let x = COL / 2; x < W; x += COL) if (Math.random() < 0.35) streams.push(spawn(x, true));
      draw();
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.font = `11px ${font}`;
      ctx.textAlign = "center";
      for (const s of streams) {
        for (let k = 0; k < s.len; k++) {
          const y = s.y - k * LINE;
          if (y < -LINE || y > H + LINE) continue;
          const fade = 1 - k / s.len; // head brightest, tail fades out
          ctx.globalAlpha = s.alpha * fade;
          ctx.fillStyle = s.green && k === 0 ? "#19c37d" : "#c9d0cc";
          ctx.fillText(s.chars[k % s.chars.length], s.x, y);
        }
      }
      ctx.globalAlpha = 1;
    };

    // background drifts a few px against the cursor (parallax), desktop only
    const shift = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      shift.tx = (e.clientX / window.innerWidth - 0.5) * -10;
      shift.ty = (e.clientY / window.innerHeight - 0.5) * -6;
    };
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (fine && !reduce) window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0, running = false, last = 0, acc = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      acc += dt;
      if (acc < 1 / 30) return; // 30fps is plenty for slow drift
      for (const s of streams) {
        s.y += s.speed * acc;
        if (Math.random() < 0.01) s.chars[(Math.random() * s.chars.length) | 0] = rand(CHARS);
        if (s.y - s.len * LINE > H) Object.assign(s, spawn(s.x, false));
      }
      acc = 0;
      shift.x += (shift.tx - shift.x) * 0.08;
      shift.y += (shift.ty - shift.y) * 0.08;
      canvas.style.translate = `${shift.x.toFixed(1)}px ${shift.y.toFixed(1)}px`;
      draw();
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
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none font-mono", className)} />;
}

export default DigitalRain;
