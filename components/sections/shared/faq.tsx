import Link from "next/link";
import { Plus } from "@phosphor-icons/react/ssr";
import { getDict, localePath, type Lang } from "@/lib/i18n";

export function Faq({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <section id="faq" className="scroll-mt-24 border-t border-hairline py-24">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div data-reveal>
          <p className="eyebrow">{t.faq.eyebrow}</p>
          <h2 className="h-section mt-3">{t.faq.title}</h2>
          <p className="mt-4">
            {t.faq.else}{" "}
            <Link href={localePath(lang, "/start")} className="link-u text-phosphor">
              {t.faq.ask}
            </Link>
            .
          </p>
        </div>
        <div className="border-t border-hairline" data-reveal>
          {t.FAQ.map((f) => (
            <details key={f.q} className="group border-b border-hairline">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-lg text-phosphor sm:text-xl [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus className="size-5 shrink-0 text-moss ease-fluid transition-transform duration-500 group-open:rotate-45" />
              </summary>
              <p className="max-w-[62ch] pb-6 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
