import { getDict, isLang, type Lang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n/meta";
import { LegalPage } from "@/components/sections/legal/legal-page";

export const generateMetadata = async ({ params }: PageProps<"/[lang]/terms">) => ({
  ...(await pageMetadata(params, "terms")),
  robots: { index: false },
});

// PLACEHOLDER: review with your own details before launch.
export default async function TermsPage({ params }: PageProps<"/[lang]/terms">) {
  const { lang: l } = await params;
  const lang: Lang = isLang(l) ? l : "en";
  const t = getDict(lang).legal;
  return (
    <LegalPage eyebrow={t.eyebrow} title={t.termsTitle}>
      {t.terms.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </LegalPage>
  );
}
