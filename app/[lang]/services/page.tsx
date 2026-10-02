import { getDict, isLang, type Lang } from "@/lib/i18n";
import { JsonLd } from "@/components/seo/json-ld";
import { pageGraph } from "@/lib/schema";
import { pageMetadata } from "@/lib/i18n/meta";
import { PageHeader } from "@/components/sections/shared/page-header";
import { ServiceList } from "@/components/sections/services/service-list";
import { Steps } from "@/components/sections/shared/steps";
import { CtaBand } from "@/components/sections/shared/cta-band";

export const generateMetadata = ({ params }: PageProps<"/[lang]/services">) => pageMetadata(params, "services");

// What we build. The full process has its own page; a three-step summary points to it.
export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang: l } = await params;
  const lang: Lang = isLang(l) ? l : "en";
  const t = getDict(lang);
  return (
    <>
      <JsonLd graph={pageGraph(lang, "/services", t.meta.services.title, t.meta.services.description)} />
      <PageHeader {...t.servicesPage} />
      <ServiceList lang={lang} />
      <Steps lang={lang} />
      <CtaBand lang={lang} />
    </>
  );
}
