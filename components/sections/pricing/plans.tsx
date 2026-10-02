import Link from "next/link";
import { ArrowRight, Check } from "@phosphor-icons/react/ssr";
import { getDict, localePath, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Same dark surfaces as the rest of the site. The featured plan gets the green edge.
export function Plans({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <section id="pricing" className="pb-24">
      <div className="wrap">
        <div className="grid gap-4 lg:grid-cols-3">
          {t.PACKAGES.map((p) => {
            const featured = p.featured;
            return (
              <article
                key={p.name}
                data-reveal="scale"
                className={cn(
                  "spot relative flex flex-col rounded-lg border bg-ground p-8",
                  featured
                    ? "border-lime/60 shadow-[0_0_0_1px_rgba(25,195,125,0.25),0_24px_60px_-32px_rgba(25,195,125,0.55)]"
                    : "border-hairline hover:border-circuit"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-2xl">{p.name}</h3>
                  {featured && (
                    <span className="rounded-full bg-lime px-3 py-1 text-xs font-medium text-void">{t.pricing.popular}</span>
                  )}
                </div>
                <p className="mt-2">{p.for}</p>
                <div className="mt-8">
                  <p className="text-xs uppercase tracking-[0.05em] text-sage-dim">{p.note}</p>
                  <p className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-5xl tracking-[-0.02em] text-phosphor">{p.price}</span>
                    <span className="text-sm font-medium text-moss">{t.currency}</span>
                  </p>
                </div>
                <ul className="mt-8 flex-1 space-y-3 border-t border-hairline pt-6">
                  {p.items.map((x) => (
                    <li key={x} className="flex gap-3">
                      <Check weight="bold" className="mt-1 size-4 shrink-0 text-lime" />
                      {x}
                    </li>
                  ))}
                </ul>
                <Link href={localePath(lang, `/start?type=${p.type}`)} className={cn("mt-8", featured ? "btn-lime" : "btn-ghost")}>
                  {t.pricing.cta} <ArrowRight className="size-4 rtl:-scale-x-100" />
                </Link>
              </article>
            );
          })}
        </div>
        <p className="mt-10 max-w-3xl text-sm leading-relaxed" data-reveal>
          <span className="font-medium text-phosphor">{t.pricing.includesLabel}</span> {t.pricing.includes}
        </p>
      </div>
    </section>
  );
}
