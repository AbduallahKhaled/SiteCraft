import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { CodeSphere } from "@/components/ui/code-sphere";
import { DigitalRain } from "@/components/ui/digital-rain";
import { getDict, localePath, type Lang } from "@/lib/i18n";

export function Hero({ lang }: { lang: Lang }) {
  const t = getDict(lang).hero;
  const L = (p: string) => localePath(lang, p);
  return (
    <section id="top" className="relative overflow-hidden pt-24 sm:pt-32">
      <DigitalRain className="rain-mask absolute inset-x-0 top-0 h-[900px] w-full" />
      <div className="wrap relative grid items-center gap-8 lg:min-h-[600px] lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        {/* entrance sequence: eyebrow → headline → text → CTAs → sphere */}
        <div className="relative z-10 max-w-[640px]">
          <p className="chip font-mono" data-reveal data-delay="0">
            <span className="relative flex size-2" aria-hidden>
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-lime" />
            </span>
            {t.chip}
          </p>
          <h1 className="mt-6 text-5xl leading-none sm:text-6xl lg:text-7xl" data-reveal data-delay="120">
            {t.h1[0]}
            <span className="text-lime">{t.h1[1]}</span>
            {t.h1[2]}
          </h1>
          <p className="lead mt-6 max-w-[560px]" data-reveal data-delay="240">
            {t.lead}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center" data-reveal data-delay="360">
            <Link href={L("/start")} className="btn-lime">
              {t.cta} <ArrowRight className="size-4 rtl:-scale-x-100" />
            </Link>
            <Link href={L("/work")} className="btn-ghost">
              {t.cta2}
            </Link>
          </div>
        </div>

        {/* interactive code sphere (fills the right column) */}
        <div className="relative mx-auto aspect-square w-full max-w-[360px] sm:max-w-[480px] lg:max-w-[580px]" data-reveal="scale" data-delay="480">
          <div className="halo pointer-events-none absolute inset-[8%] rounded-full" aria-hidden />
          <CodeSphere className="absolute inset-0" />
        </div>
      </div>

      <div className="wrap mt-16">
        <ul className="grid grid-cols-2 border-y border-hairline font-mono text-xs text-moss sm:grid-cols-4">
          {t.stats.map(([a, b], i) => (
            <li
              key={a}
              className={`border-hairline px-4 py-4 ${i % 2 ? "border-s" : ""} ${i > 1 ? "border-t sm:border-t-0" : ""} sm:border-s sm:first:border-s-0`}
            >
              <span className="block text-phosphor">{a}</span>
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
