"use client";
// Global cursor interactions, opt-in per element:
//   [data-tilt]      card tilts up to ~2deg toward the cursor and lifts slightly
//   .spot            border highlight + glow follow the cursor (sets --mx / --my)
// Desktop pointers only. Disabled for prefers-reduced-motion.
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const TILT_MAX = 2; // deg

export function MotionFx() {
  const path = usePathname();

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];

    // Spotlight vars are harmless everywhere; only hover shows them.
    document.querySelectorAll<HTMLElement>(".spot").forEach((el) => {
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      };
      el.addEventListener("pointermove", onMove);
      cleanups.push(() => el.removeEventListener("pointermove", onMove));
    });

    if (!finePointer || reduce) return () => cleanups.forEach((c) => c());

    // ---- tilt -----------------------------------------------------------
    document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
      let frame = 0;
      const onMove = (e: PointerEvent) => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          el.style.transition = "transform 250ms cubic-bezier(0.22,1,0.36,1), border-color 300ms ease";
          el.style.transform = `perspective(900px) translateY(-4px) rotateX(${(-py * TILT_MAX).toFixed(2)}deg) rotateY(${(px * TILT_MAX).toFixed(2)}deg)`;
          el.style.setProperty("--tx", `${(px * 6).toFixed(1)}px`);
          el.style.setProperty("--ty", `${(py * 6).toFixed(1)}px`);
        });
      };
      const onLeave = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        el.style.transition = "transform 450ms cubic-bezier(0.34,1.56,0.64,1), border-color 300ms ease";
        el.style.transform = "";
        el.style.setProperty("--tx", "0px");
        el.style.setProperty("--ty", "0px");
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      });
    });

    return () => cleanups.forEach((c) => c());
  }, [path]);

  return null;
}

// Thin page progress bar (sits at the bottom edge of the nav).
export function ScrollProgress() {
  useEffect(() => {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div
      id="scroll-progress"
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-px origin-left bg-lime/80"
      style={{ transform: "scaleX(0)", transition: "transform 120ms linear" }}
    />
  );
}
