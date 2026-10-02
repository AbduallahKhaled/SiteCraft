import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/ssr";
import { getDict, localePath, type Lang } from "@/lib/i18n";

// Six project types with starting prices, each a door into the quote form.
export function ServicesOverview({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const L = (p: string) => localePath(lang, p);
  return (
    <section id="home-services" tabIndex={-1} className="scroll-mt-24 border-t border-hairline py-24 outline-none" aria-labelledby="home-services-title">
      <div className="wrap">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-reveal>
          <div>
            <p className="eyebrow">{t.homeServices.eyebrow}</p>
            <h2 id="home-services-title" className="h-section mt-3">
              {t.homeServices.title}
            </h2>
            <p className="mt-3 max-w-xl">{t.homeServices.body}</p>
          </div>
          <Link
            href={L("/pricing")}
            className="arrow-nudge inline-flex w-fit items-center gap-2 rounded-xl border border-circuit px-4 py-2 text-sm font-semibold text-phosphor transition-colors duration-200 ease-out hover:border-moss"
          >
            {t.homeServices.compare} <ArrowRight className="size-4 rtl:-scale-x-100" />
          </Link>
        </div>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {t.SERVICES.map((s) => (
            <li key={s.cmd} className="bg-void">
              <Link
                href={L(`/start?type=${s.type}`)}
                className="spot group flex h-full flex-col p-8 transition-colors duration-300 ease-out hover:bg-ground"
              >
                <span className="font-mono text-xs text-sage-dim" dir="ltr">
                  <span className="text-fern">~ $</span> sitecraft new <span className="text-moss">{s.cmd}</span>
                </span>
                <h3 className="mt-4 text-xl tracking-[-0.013em]">{s.title}</h3>
                <p className="mt-2 flex-1 leading-relaxed">{s.body}</p>
                <span className="mt-6 flex items-center justify-between gap-3 text-sm">
                  <span className="text-sage-dim">
                    {t.homeServices.from} <span className="font-semibold text-phosphor">{s.from}</span> {t.currency}
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-fern transition-colors duration-200 group-hover:text-lime">
                    {t.homeServices.quote}{" "}
                    <ArrowUpRight className="size-3.5 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 rtl:-scale-x-100" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
