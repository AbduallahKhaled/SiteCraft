import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import { getDict, localePath, type Lang } from "@/lib/i18n";

export function ServiceList({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <section id="services" className="scroll-mt-16 pb-24">
      <div className="wrap">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.SERVICES.map((s) => (
            <article
              key={s.cmd}
              id={s.cmd}
              data-reveal="scale"
              data-tilt
              className="spot group flex scroll-mt-24 flex-col rounded-lg border border-hairline bg-ground p-8 hover:border-circuit"
            >
              <p
                className="w-fit rounded-md border border-hairline bg-void/60 px-2 py-1 font-mono text-xs text-sage-dim transition-[translate,border-color] duration-300 ease-out group-hover:border-circuit"
                style={{ translate: "var(--tx, 0px) var(--ty, 0px)" }}
              >
                <span className="text-fern">~ $</span> sitecraft new <span className="text-moss">{s.cmd}</span>
              </p>
              <h3 className="mt-4 text-2xl tracking-[-0.013em]">{s.title}</h3>
              <p className="mt-2 text-base leading-relaxed">{s.body}</p>
              <ul className="mt-6 space-y-2 border-t border-hairline pt-4 font-mono text-xs text-moss">
                {s.spec.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="text-lime" aria-hidden>
                      +
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-sage-dim">
                {t.homeServices.from} <span className="font-semibold text-phosphor">{s.from}</span> {t.currency}
              </p>
              <Link
                href={localePath(lang, `/start?type=${s.type}`)}
                className="arrow-nudge mt-4 inline-flex w-fit items-center gap-2 rounded-xl border border-circuit/70 px-3 py-2 text-sm font-medium text-fern transition-colors duration-200 ease-out hover:border-moss hover:text-phosphor"
              >
                {t.homeServices.quote} <ArrowUpRight className="size-3.5 rtl:-scale-x-100" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
