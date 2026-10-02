import { Suspense } from "react";
import { getDict, isLang, type Lang } from "@/lib/i18n";
import { JsonLd } from "@/components/seo/json-ld";
import { pageGraph } from "@/lib/schema";
import { pageMetadata } from "@/lib/i18n/meta";
import { Brief } from "@/components/sections/start/brief";

export const generateMetadata = ({ params }: PageProps<"/[lang]/start">) => pageMetadata(params, "start");

export default async function StartPage({ params }: PageProps<"/[lang]/start">) {
  const { lang: l } = await params;
  const lang: Lang = isLang(l) ? l : "en";
  // useSearchParams needs a Suspense boundary for static rendering
  const m = getDict(lang).meta.start;
  return (
    <>
      <JsonLd graph={pageGraph(lang, "/start", m.title, m.description)} />
      <Suspense>
        <Brief lang={lang} />
      </Suspense>
    </>
  );
}
