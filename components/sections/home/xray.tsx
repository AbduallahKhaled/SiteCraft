import Link from "next/link";
import { ArrowRight, Check, Scan } from "@phosphor-icons/react/ssr";
import { XRayReveal } from "@/components/ui/xray-reveal";
import { getDict, localePath, type Lang } from "@/lib/i18n";

// "Under the hood": the finished page on top, its source code under the lens.
export function XRay({ lang }: { lang: Lang }) {
  const t = getDict(lang).xray;
  const L = (p: string) => localePath(lang, p);
  return (
    <section className="border-t border-hairline py-24">
      <div className="wrap grid items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div className="relative w-full max-w-[680px]" data-reveal="left">
          <div className="relative mb-3 flex items-center justify-between gap-3 px-1 font-mono text-xs text-sage-dim">
            <span>{lang === "ar" ? "sitecraft.dev/ar" : "sitecraft.dev"}</span>
            <span className="inline-flex items-center gap-2 text-moss">
              <Scan className="size-4" aria-hidden />
              <span className="hidden sm:inline">{t.hint}</span>
              <span className="sm:hidden">{t.hintTouch}</span>
            </span>
          </div>
          <div className="relative rounded-2xl border border-circuit bg-ground p-1.5">
            <XRayReveal
              src={`/hero/site-front-${lang}.webp`}
              backSrc="/hero/site-xray.webp"
              alt={t.alt}
              aspect={1200 / 760}
              className="rounded-xl"
            />
          </div>
        </div>

        <div data-reveal data-delay="120">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h-section mt-3">{t.title}</h2>
          <p className="mt-4 leading-relaxed">{t.body}</p>
          <ul className="mt-6 space-y-3 border-t border-hairline pt-5 text-sm">
            {t.points.map(([a, b]) => (
              <li key={a} className="flex gap-3">
                <Check weight="bold" className="mt-0.5 size-4 shrink-0 text-lime" aria-hidden />
                <span>
                  <span className="text-phosphor">{a}</span>{lang === "ar" ? "، " : ", "}{b}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href={L("/start")}
            className="arrow-nudge link-u mt-8 inline-flex items-center gap-2 text-sm font-semibold text-phosphor"
          >
            {t.link} <ArrowRight className="size-4 rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    </section>
  );
}
