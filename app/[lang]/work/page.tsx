import { getDict, isLang, type Lang } from "@/lib/i18n";
import { JsonLd } from "@/components/seo/json-ld";
import { pageGraph, workGraph } from "@/lib/schema";
import { pageMetadata } from "@/lib/i18n/meta";
import { WorkGallery } from "@/components/sections/work/gallery";
import { CtaBand } from "@/components/sections/shared/cta-band";

export const generateMetadata = ({ params }: PageProps<"/[lang]/work">) => pageMetadata(params, "work");

export default async function WorkPage({ params }: PageProps<"/[lang]/work">) {
  const { lang: l } = await params;
  const lang: Lang = isLang(l) ? l : "en";
  const t = getDict(lang);
  return (
    <>
      <JsonLd graph={[...pageGraph(lang, "/work", t.meta.work.title, t.meta.work.description), workGraph(lang)]} />
      <WorkGallery lang={lang} />
      <CtaBand lang={lang} title={t.workPage.ctaTitle} body={t.workPage.ctaBody} />
    </>
  );
}
