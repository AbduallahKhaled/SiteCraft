// Structured data (schema.org JSON-LD) for search engines and AI answer engines.
// One @graph per page: the business, the site, and what this page is about.
import { SITE } from "./site";
import { getDict, localePath, type Lang } from "./i18n";

const abs = (p: string) => `${SITE.url}${p === "/" ? "" : p}`;
const num = (s: string) => Number(s.replace(/,/g, ""));
export const ORG_ID = `${SITE.url}/#business`;
const SITE_ID = `${SITE.url}/#website`;

/** The business and the website. Rendered once per page from the root layout. */
export function siteGraph(lang: Lang) {
  const t = getDict(lang);
  return [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": ORG_ID,
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}/icon.svg`,
      image: `${SITE.url}/hero/site-en.webp`,
      description: t.meta.description,
      slogan: t.footer.tagline,
      email: SITE.email,
      telephone: `+${SITE.whatsapp}`,
      areaServed: { "@type": "Country", name: "Egypt" },
      knowsLanguage: ["en", "ar"],
      currenciesAccepted: SITE.currency,
      priceRange: `${SITE.currency} ${t.PACKAGES[0].price}+`,
      knowsAbout: ["Web design", "Web development", "E-commerce", "Next.js", "SEO", "Landing pages", "Web apps"],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: SITE.email,
        url: abs(localePath(lang, "/start")),
        availableLanguage: ["English", "Arabic"],
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: t.meta.services.title,
        itemListElement: t.SERVICES.map((s) => ({
          "@type": "Offer",
          url: abs(localePath(lang, "/services")),
          priceSpecification: {
            "@type": "PriceSpecification",
            price: num(s.from),
            minPrice: num(s.from),
            priceCurrency: SITE.currency,
          },
          itemOffered: { "@type": "Service", name: s.title, description: `${s.body} ${s.spec.join(". ")}.` },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      url: SITE.url,
      name: SITE.name,
      description: t.meta.ogDescription,
      inLanguage: ["en", "ar"],
      publisher: { "@id": ORG_ID },
    },
  ];
}

/** This page, plus a breadcrumb for inner pages. */
export function pageGraph(lang: Lang, path: string, name: string, description?: string) {
  const t = getDict(lang);
  const url = abs(localePath(lang, path));
  const page = {
    "@type": "WebPage",
    "@id": `${url}#page`,
    url,
    name,
    description,
    inLanguage: lang,
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
  };
  if (path === "/") return [page];
  return [
    page,
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t.nav.home, item: abs(localePath(lang, "/")) },
        { "@type": "ListItem", position: 2, name, item: url },
      ],
    },
  ];
}

export function faqGraph(lang: Lang) {
  return {
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: getDict(lang).FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function workGraph(lang: Lang) {
  const t = getDict(lang);
  return {
    "@type": "ItemList",
    name: t.meta.work.title,
    itemListElement: t.WORK.map((w, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: `${w.title} (${w.kind})`,
        description: w.desc,
        image: `${SITE.url}/work/${w.id}.webp`,
        creator: { "@id": ORG_ID },
      },
    })),
  };
}

/** <script type="application/ld+json"> body. "<" is escaped so text can never close the tag. */
export const ldJson = (graph: object[]) =>
  JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
