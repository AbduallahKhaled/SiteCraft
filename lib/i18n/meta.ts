import type { Metadata } from "next";
import { SITE } from "../site";
import { getDict, isLang, localePath } from "./index";

type PageKey = "work" | "services" | "process" | "pricing" | "start" | "privacy" | "terms";

// Title, description, canonical and the other-language link for one inner page.
export async function pageMetadata(params: Promise<{ lang: string }>, key: PageKey): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const m = getDict(lang).meta[key];
  const path = `/${key}`;
  const description = "description" in m ? m.description : undefined;
  const image = { url: `/og-${lang}.jpg`, width: 1200, height: 630, alt: `${m.title} | ${SITE.name}` };
  return {
    title: m.title,
    description,
    alternates: {
      canonical: localePath(lang, path),
      languages: { en: path, ar: localePath("ar", path), "x-default": path },
      types: { "text/plain": "/llms.txt" },
    },
    // page-level Open Graph replaces the layout's, so repeat the shared fields
    openGraph: {
      title: `${m.title} | ${SITE.name}`,
      description,
      url: localePath(lang, path),
      siteName: SITE.name,
      images: [image],
      type: "website",
      locale: lang === "ar" ? "ar_EG" : "en_US",
    },
    twitter: { card: "summary_large_image", title: `${m.title} | ${SITE.name}`, description, images: [image] },
  };
}
