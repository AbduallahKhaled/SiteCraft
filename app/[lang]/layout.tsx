import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import { SITE } from "@/lib/site";
import { LANGS, dirOf, getDict, isLang, localePath } from "@/lib/i18n";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Reveal } from "@/components/effects/reveal";
import { MotionFx } from "@/components/effects/motion-fx";
import { JsonLd } from "@/components/seo/json-ld";
import { siteGraph } from "@/lib/schema";
import "../globals.css";

// Brand: Inter for everything. Geist Mono only for code and data.
// Arabic pages use IBM Plex Sans Arabic (it also covers Latin), loaded only there.
const sans = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono-code", subsets: ["latin"] });
const arabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

// Both languages are prerendered; anything else is a 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDict(lang);
  const image = { url: `/og-${lang}.jpg`, width: 1200, height: 630, alt: t.meta.title };
  return {
    metadataBase: new URL(SITE.url),
    applicationName: SITE.name,
    title: { default: t.meta.title, template: `%s | ${SITE.name}` },
    description: t.meta.description,
    alternates: {
      canonical: localePath(lang, "/"),
      languages: { en: "/", ar: "/ar", "x-default": "/" },
      // plain-text brief for AI assistants
      types: { "text/plain": "/llms.txt" },
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: {
      title: t.meta.title,
      description: t.meta.ogDescription,
      url: localePath(lang, "/"),
      siteName: SITE.name,
      images: [image],
      type: "website",
      locale: lang === "ar" ? "ar_EG" : "en_US",
      alternateLocale: lang === "ar" ? "en_US" : "ar_EG",
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.ogDescription, images: [image] },
  };
}

export const viewport: Viewport = { themeColor: "#080b09", colorScheme: "dark" };

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const fonts = `${sans.variable} ${mono.variable} ${lang === "ar" ? arabic.variable : ""}`;

  return (
    <html lang={lang} dir={dirOf(lang)} className={`${fonts} h-full`}>
      <body className="flex min-h-full flex-col">
        <JsonLd graph={siteGraph(lang)} />
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-lime px-4 py-2 text-sm font-semibold text-black focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          {t.nav.skip}
        </a>
        <Nav lang={lang} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer lang={lang} />
        <Reveal />
        <MotionFx />
      </body>
    </html>
  );
}
