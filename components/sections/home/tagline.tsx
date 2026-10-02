"use client";
// Big tagline: words light up one at a time, in reading order, as the section scrolls through.
// One passive scroll listener, throttled through requestAnimationFrame.
import { useEffect, useRef, useState } from "react";
import { getDict, type Lang } from "@/lib/i18n";

export function Tagline({ lang }: { lang: Lang }) {
  const t = getDict(lang).tagline;
  const ref = useRef<HTMLParagraphElement>(null);
  const words = t.text.split(" ");
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const el = ref.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (reduce) return setLit(words.length);
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the block's top reaches 85% of the viewport, 1 when its bottom reaches 45%
      const start = vh * 0.85;
      const end = vh * 0.45;
      const p = (start - r.top) / (start - end + r.height);
      setLit(Math.round(Math.max(0, Math.min(1, p)) * words.length));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [words.length]);

  return (
    <section className="border-t border-hairline py-24 sm:py-40" aria-label={t.aria}>
      <div className="wrap">
        <p className="eyebrow">{t.eyebrow}</p>
        <p
          ref={ref}
          className="mt-6 max-w-[880px] font-display text-4xl leading-tight tracking-[-0.015em] text-balance sm:text-6xl sm:leading-none"
        >
          {words.map((w, i) => (
            <span
              key={i}
              className="ease-fluid transition-colors duration-700"
              style={{ color: i < lit ? "var(--color-phosphor)" : "rgba(245,247,246,0.18)" }}
            >
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
