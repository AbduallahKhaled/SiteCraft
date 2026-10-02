"use client";
// Five-step process as an interactive timeline.
//  - scrolling: the step crossing the middle of the viewport becomes active, the rail fills to it
//  - hover / keyboard focus: selects a step directly (overrides scroll while held)
//  - the build log on the right mirrors progress: done ✓, current ›, queued ·
import { useEffect, useRef, useState } from "react";
import { getDict, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function ProcessTimeline({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const PROCESS = t.PROCESS;
  const [scrollStep, setScrollStep] = useState(0);
  const [hoverStep, setHoverStep] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const active = hoverStep ?? scrollStep;

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setScrollStep(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" } // a thin band across the middle of the viewport
    );
    itemRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const n = PROCESS.length;

  return (
    <section id="process" className="scroll-mt-24 pb-24">
      <div className="wrap grid items-start gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <div data-reveal>
            <p className="eyebrow">{t.process.eyebrow}</p>
            <h2 className="h-section mt-3">{t.process.title}</h2>
            <p className="lead mt-4">{t.process.lead}</p>
          </div>

          <ol className="relative mt-10" onMouseLeave={() => setHoverStep(null)}>
            {/* rail + animated fill (fills to the middle of the active step) */}
            <span aria-hidden className="absolute start-[19px] top-6 bottom-6 w-px bg-circuit" />
            <span
              aria-hidden
              className="absolute start-[19px] top-6 w-px origin-top bg-lime transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ height: "calc(100% - 48px)", transform: `scaleY(${active / (n - 1)})` }}
            />
            {PROCESS.map((p, i) => {
              const isActive = i === active;
              const done = i < active;
              return (
                <li
                  key={p.step}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  data-index={i}
                  tabIndex={0}
                  aria-current={isActive ? "step" : undefined}
                  onMouseEnter={() => setHoverStep(i)}
                  onFocus={() => setHoverStep(i)}
                  onBlur={() => setHoverStep(null)}
                  className={cn(
                    "relative grid cursor-default grid-cols-[40px_1fr] gap-4 rounded-xl py-3 pe-4 outline-none transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isActive ? "-translate-y-0.5 opacity-100" : "opacity-55 hover:opacity-80"
                  )}
                >
                  <span
                    className={cn(
                      "relative z-10 mt-2 flex size-10 items-center justify-center rounded-full border font-mono text-xs transition-[background-color,border-color,color,box-shadow] duration-300",
                      isActive
                        ? "border-lime bg-lime text-void shadow-[0_0_0_6px_rgba(25,195,125,0.14)]"
                        : done
                          ? "border-lime/60 bg-void text-lime"
                          : "border-circuit bg-void text-sage-dim"
                    )}
                  >
                    0{i + 1}
                  </span>
                  <div
                    className={cn(
                      "rounded-xl border px-4 py-3 transition-[background-color,border-color] duration-300",
                      isActive ? "border-circuit bg-ground" : "border-transparent"
                    )}
                  >
                    <h3 className={cn("text-xl transition-colors duration-300", isActive ? "text-phosphor" : "text-moss")}>
                      {p.title}
                    </h3>
                    <p className={cn("mt-1 transition-colors duration-300", isActive ? "text-moss-bright" : "text-sage")}>
                      {p.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="code-window lg:sticky lg:top-28" data-reveal dir="ltr">
          <div className="code-bar">
            <i />
            <i />
            <i />
            <span className="ml-auto text-xs font-medium text-moss">build.log</span>
          </div>
          <div className="space-y-3 p-6 font-mono text-xs leading-relaxed sm:p-8 sm:text-sm" aria-live="polite">
            <p className="text-phosphor">
              <span className="text-fern">$</span> sitecraft ship your-business
            </p>
            {t.process.log.map(([k, v], i) => {
              const state = i < active ? "done" : i === active ? "now" : "queued";
              return (
                <p
                  key={k}
                  className={cn("flex gap-3 transition-opacity duration-300", state === "queued" ? "opacity-35" : "opacity-100")}
                >
                  <span className={cn("w-3", state === "queued" ? "text-sage-dim" : "text-lime")}>
                    {state === "done" ? "✓" : state === "now" ? "›" : "·"}
                  </span>
                  <span className="w-16 shrink-0 text-phosphor">{k}</span>
                  <span className={state === "now" ? "text-lime" : "text-sage"} dir="auto">
                    {state === "now" ? `${v} …` : v}
                  </span>
                </p>
              );
            })}
            <p className={cn("flex gap-3 transition-opacity duration-300", active === n - 1 ? "opacity-100" : "opacity-35")}>
              <span className="w-3 text-sage-dim">~</span>
              <span className="w-16 shrink-0 text-phosphor">support</span>
              <span className="text-sage" dir="auto">
                {t.process.support}
              </span>
            </p>
            <p className="pt-3 text-sage-dim" dir="auto">
              {"// "}
              {t.process.typical}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
