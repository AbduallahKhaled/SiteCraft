import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { localePath } from "@/lib/i18n";

// Every indexable page in English and Arabic (privacy and terms are noindex), each pointing at its other-language twin.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number][] = [
    ["/", 1],
    ["/work", 0.8],
    ["/services", 0.8],
    ["/process", 0.7],
    ["/pricing", 0.8],
    ["/start", 0.9],
  ];
  const url = (p: string) => `${SITE.url}${p === "/" ? "" : p}`;
  return pages.flatMap(([path, priority]) =>
    (["en", "ar"] as const).map((lang) => ({
      url: url(localePath(lang, path)),
      lastModified: new Date(),
      priority,
      alternates: { languages: { en: url(path), ar: url(localePath("ar", path)) } },
    }))
  );
}
