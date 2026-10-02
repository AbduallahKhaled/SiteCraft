import { getDict, isLang, type Lang } from "@/lib/i18n";
import { JsonLd } from "@/components/seo/json-ld";
import { pageGraph } from "@/lib/schema";
import { pageMetadata } from "@/lib/i18n/meta";
import { PageHeader } from "@/components/sections/shared/page-header";
import { ProcessTimeline } from "@/components/sections/process/timeline";
import { Stack } from "@/components/sections/process/stack";
import { CtaBand } from "@/components/sections/shared/cta-band";

export const generateMetadata = ({ params }: PageProps<"/[lang]/process">) => pageMetadata(params, "process");

// How a project runs, step by step, and the tools behind it.
export default async function ProcessPage({ params }: PageProps<"/[lang]/process">) {
  const { lang: l } = await params;
  const lang: Lang = isLang(l) ? l : "en";
  const t = getDict(lang);
  return (
    <>
      <JsonLd graph={pageGraph(lang, "/process", t.meta.process.title, t.meta.process.description)} />
      <PageHeader {...t.processPage} />
      <ProcessTimeline lang={lang} />
      <Stack lang={lang} />
      <CtaBand lang={lang} />
    </>
  );
}
