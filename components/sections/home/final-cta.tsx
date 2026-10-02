import Link from "next/link";
import { ArrowRight, Check, WhatsappLogo } from "@phosphor-icons/react/ssr";
import { SITE } from "@/lib/site";
import { getDict, localePath, type Lang } from "@/lib/i18n";

// Last thing on the home page: two ways to start, and what happens next.
export function FinalCta({ lang }: { lang: Lang }) {
  const t = getDict(lang).finalCta;
  const wa = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t.waMessage)}`;
  return (
    <section className="border-t border-hairline py-24">
      <div className="wrap">
        <div
          className="relative overflow-hidden rounded-3xl border border-circuit bg-ground px-6 py-16 text-center sm:px-12 sm:py-20"
          data-reveal="scale"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-80 max-w-2xl rounded-full bg-lime/15 blur-3xl"
          />
          <p className="chip relative font-mono">
            <span className="size-1.5 rounded-full bg-lime" aria-hidden /> {t.chip}
          </p>
          <h2 className="relative mx-auto mt-6 max-w-[18ch] text-4xl tracking-[-0.02em] sm:text-6xl">
            {t.title}
          </h2>
          <p className="lead relative mx-auto mt-6 max-w-xl">
            {t.body}
          </p>
          <div className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={localePath(lang, "/start")} className="btn-lime">
              {t.cta} <ArrowRight className="size-4 rtl:-scale-x-100" />
            </Link>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <WhatsappLogo className="size-4" /> {t.cta2}
            </a>
          </div>
          <ul className="relative mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-xs text-sage-dim">
            {t.points.map((x) => (
              <li key={x} className="flex items-center gap-2">
                <Check weight="bold" className="size-3.5 text-lime" aria-hidden /> {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
