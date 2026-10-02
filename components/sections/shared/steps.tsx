import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import { getDict, localePath, type Lang } from "@/lib/i18n";

// Three-step summary of how a project runs, linking to the full process page.
export function Steps({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <section className="border-t border-hairline py-24" aria-labelledby="steps-title">
      <div className="wrap">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-reveal>
          <div>
            <p className="eyebrow">{t.homeSteps.eyebrow}</p>
            <h2 id="steps-title" className="h-section mt-3">
              {t.homeSteps.title}
            </h2>
          </div>
          <Link
            href={localePath(lang, "/process")}
            className="arrow-nudge link-u inline-flex w-fit items-center gap-1 text-sm font-semibold text-fern hover:text-phosphor"
          >
            {t.homeSteps.link} <ArrowUpRight className="size-4 rtl:-scale-x-100" />
          </Link>
        </div>
        <ol className="group/steps mt-12 grid gap-4 md:grid-cols-3">
          {t.HOME_STEPS.map((s, i) => (
            <li
              key={s.title}
              data-reveal="scale"
              className="spot rounded-lg border border-hairline bg-ground p-8 transition-[opacity,transform] duration-300 ease-out group-has-[li:hover]/steps:opacity-60 hover:!opacity-100 hover:-translate-y-1"
            >
              <span className="font-mono text-xs text-sage-dim">0{i + 1}</span>
              <h3 className="mt-4 text-2xl tracking-[-0.013em]">{s.title}</h3>
              <p className="mt-2 text-base leading-relaxed">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
