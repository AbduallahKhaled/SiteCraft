"use client";
import { WorkRail } from "@/components/ui/work-rail";
import { getDict, localePath, type Lang } from "@/lib/i18n";

export function WorkGallery({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const items = t.WORK.map((w) => ({ ...w, src: `/work/${w.id}.webp` }));
  return (
    <WorkRail
      id="work"
      items={items}
      href={() => localePath(lang, "/start")}
      labels={{ ...t.rail, open: t.rail.like }}
      header={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">{t.workPage.eyebrow}</p>
            <h1 id="work-title" className="mt-4 max-w-[16ch] text-4xl tracking-[-0.02em] sm:text-5xl">
              {t.workPage.title}
            </h1>
          </div>
          <p className="max-w-[34ch] text-sm text-sage">{t.workPage.body}</p>
        </div>
      }
    />
  );
}
