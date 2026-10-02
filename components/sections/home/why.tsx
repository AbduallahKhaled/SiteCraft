import Link from "next/link";
import { ArrowRight, Key, Lightning, MagnifyingGlass, PencilSimple } from "@phosphor-icons/react/ssr";
import { getDict, localePath, type Lang } from "@/lib/i18n";

const WHY_ICONS = [Key, Lightning, MagnifyingGlass, PencilSimple];

// What the client gets, whatever they order.
export function Why({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <section className="border-t border-hairline py-24" aria-labelledby="why-title">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div data-reveal>
          <p className="eyebrow">{t.why.eyebrow}</p>
          <h2 id="why-title" className="h-section mt-3">
            {t.why.title}
          </h2>
          <p className="mt-4 leading-relaxed">{t.why.body}</p>
          <Link href={localePath(lang, "/process")} className="arrow-nudge link-u mt-6 inline-flex items-center gap-2 text-sm font-semibold text-phosphor">
            {t.why.link} <ArrowRight className="size-4 rtl:-scale-x-100" />
          </Link>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2">
          {t.STACK_POINTS.map((p, i) => {
            const Icon = WHY_ICONS[i];
            return (
              <div key={p.title} data-reveal="scale" className="spot rounded-lg border border-hairline bg-ground p-6">
                <Icon className="size-5 text-lime" aria-hidden />
                <dt className="mt-4 text-lg font-semibold text-phosphor">{p.title}</dt>
                <dd className="mt-2 leading-relaxed">{p.body}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
