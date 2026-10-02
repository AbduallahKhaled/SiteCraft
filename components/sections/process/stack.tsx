import { IntegrationCard, Integration } from "@/components/ui/integration-card";
import { getDict, type Lang } from "@/lib/i18n";

export function Stack({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <section className="border-t border-hairline py-24">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2">
        <div>
          <div data-reveal>
            <p className="eyebrow">{t.stack.eyebrow}</p>
            <h2 className="h-section mt-3">{t.stack.title}</h2>
          </div>
          <dl className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {t.STACK_POINTS.map((p) => (
              <div key={p.title} data-reveal className="border-t border-circuit pt-4">
                <dt className="font-display text-lg text-phosphor">{p.title}</dt>
                <dd className="mt-2 leading-relaxed">{p.body}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div data-reveal>
          <IntegrationCard
            visual={<Integration />}
            title={t.stack.cardTitle}
            description={t.stack.cardBody}
            url="#process"
            cta={t.stack.cardCta}
            tools={t.stack.tools}
          />
        </div>
      </div>
    </section>
  );
}
