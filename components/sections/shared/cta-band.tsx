import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { getDict, localePath, type Lang } from "@/lib/i18n";

// Closing call to action used at the bottom of inner pages.
export function CtaBand({ lang, title, body }: { lang: Lang; title?: string; body?: string }) {
  const t = getDict(lang).ctaBand;
  return (
    <section className="border-t border-hairline py-24">
      <div className="wrap flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between" data-reveal>
        <div>
          <h2 className="text-4xl tracking-[-0.015em] sm:text-5xl">{title ?? t.title}</h2>
          <p className="lead mt-4 max-w-xl">{body ?? t.body}</p>
        </div>
        <Link href={localePath(lang, "/start")} className="btn-lime shrink-0">
          {t.cta} <ArrowRight className="size-4 rtl:-scale-x-100" />
        </Link>
      </div>
    </section>
  );
}
