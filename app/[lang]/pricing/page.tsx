import { getDict, isLang, type Lang } from "@/lib/i18n";
import { JsonLd } from "@/components/seo/json-ld";
import { faqGraph, pageGraph } from "@/lib/schema";
import { pageMetadata } from "@/lib/i18n/meta";
import { PageHeader } from "@/components/sections/shared/page-header";
import { Plans } from "@/components/sections/pricing/plans";
import { Faq } from "@/components/sections/shared/faq";
import { CtaBand } from "@/components/sections/shared/cta-band";

export const generateMetadata = ({ params }: PageProps<"/[lang]/pricing">) => pageMetadata(params, "pricing");

export default async function PricingPage({ params }: PageProps<"/[lang]/pricing">) {
  const { lang: l } = await params;
  const lang: Lang = isLang(l) ? l : "en";
  const t = getDict(lang);
  return (
    <>
      <JsonLd graph={[...pageGraph(lang, "/pricing", t.meta.pricing.title, t.meta.pricing.description), faqGraph(lang)]} />
      <PageHeader {...t.pricingPage} />
      <Plans lang={lang} />
      <Faq lang={lang} />
      <CtaBand lang={lang} />
    </>
  );
}
