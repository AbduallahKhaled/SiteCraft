"use client";
// Home version of the Work rail: pinned horizontal scroll on desktop, swipe row on phones,
// plus a Skip button that jumps past the pinned scroll.
import Link from "next/link";
import { ArrowDown, ArrowRight } from "@phosphor-icons/react";
import { WorkRail } from "@/components/ui/work-rail";
import { getDict, localePath, type Lang } from "@/lib/i18n";

export function WorkStrip({ lang, skipTo }: { lang: Lang; skipTo: string }) {
  const t = getDict(lang);
  const items = t.WORK.map((w) => ({ ...w, src: `/work/${w.id}.webp` }));
  const skip = () => {
    const el = document.getElementById(skipTo);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: reduce ? "auto" : "smooth" });
    el.focus({ preventScroll: true });
  };

  return (
    <div className="border-t border-hairline">
      <WorkRail
        id="home-work"
        items={items}
        href={() => localePath(lang, "/work")}
        labels={t.rail}
        header={
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">{t.homeWork.eyebrow}</p>
              <h2 id="home-work-title" className="h-section mt-3 max-w-[20ch]">
                {t.homeWork.title}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={localePath(lang, "/work")}
                className="arrow-nudge inline-flex items-center gap-2 rounded-xl border border-circuit bg-void/70 px-4 py-2 text-sm font-semibold text-phosphor transition-colors duration-200 ease-out hover:border-moss"
              >
                {t.homeWork.all} <ArrowRight className="size-4 rtl:-scale-x-100" />
              </Link>
              <button
                type="button"
                onClick={skip}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-sage transition-colors duration-200 ease-out hover:text-phosphor"
              >
                {t.homeWork.skip} <ArrowDown className="size-4" />
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
}
