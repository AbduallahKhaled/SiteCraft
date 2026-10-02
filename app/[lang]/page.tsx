import { getDict, isLang, type Lang } from "@/lib/i18n";
import { JsonLd } from "@/components/seo/json-ld";
import { faqGraph, pageGraph } from "@/lib/schema";
import { Hero } from "@/components/sections/home/hero";
import { XRay } from "@/components/sections/home/xray";
import { Tagline } from "@/components/sections/home/tagline";
import { WorkStrip } from "@/components/sections/home/work-strip";
import { ServicesOverview } from "@/components/sections/home/services-overview";
import { CodeCompare } from "@/components/sections/home/code-compare";
import { Why } from "@/components/sections/home/why";
import { FinalCta } from "@/components/sections/home/final-cta";
import { Steps } from "@/components/sections/shared/steps";
import { Faq } from "@/components/sections/shared/faq";

// Home tells the whole story once, briefly, and each block links to the page that goes deeper:
// promise, proof it is real code, who we are, work, services, process, try it, what you get, answers, act.
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang: l } = await params;
  const lang: Lang = isLang(l) ? l : "en";
  const t = getDict(lang);
  return (
    <>
      <JsonLd graph={[...pageGraph(lang, "/", t.meta.title, t.meta.description), faqGraph(lang)]} />
      <Hero lang={lang} />
      <XRay lang={lang} />
      <Tagline lang={lang} />
      <WorkStrip lang={lang} skipTo="home-services" />
      <ServicesOverview lang={lang} />
      <Steps lang={lang} />
      <CodeCompare lang={lang} />
      <Why lang={lang} />
      <Faq lang={lang} />
      <FinalCta lang={lang} />
    </>
  );
}
