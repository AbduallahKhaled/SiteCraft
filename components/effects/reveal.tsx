"use client";
// Progressive reveal for [data-reveal] elements: fade + rise + blur-to-sharp, once.
//   data-reveal="scale" → also scales 0.96 → 1 (cards)   data-reveal="left" → slides in from the left
//   data-delay="240"    → fixed delay in ms (used for the hero entrance sequence)
// Elements revealed together are staggered in DOM order. IntersectionObserver only.
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function Reveal() {
  const path = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.rv-in)"));
    const io = new IntersectionObserver(
      (entries) => {
        let i = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          const fixed = el.dataset.delay;
          el.style.transitionDelay = `${fixed ?? Math.min(i++ * 90, 450)}ms`;
          el.classList.add("rv-in");
          io.unobserve(el);
          // once settled, drop the reveal classes so the element keeps only its own hover transitions
          window.setTimeout(() => {
            el.style.transitionDelay = "";
            el.classList.remove("rv", "rv-scale", "rv-left");
          }, 1300 + Number(fixed ?? 0));
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    for (const el of items) {
      el.classList.add("rv");
      if (el.dataset.reveal === "scale") el.classList.add("rv-scale");
      if (el.dataset.reveal === "left") el.classList.add("rv-left");
      io.observe(el);
    }
    return () => io.disconnect();
  }, [path]);

  return null;
}
