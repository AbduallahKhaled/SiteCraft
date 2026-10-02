import { SITE } from "@/lib/site";
import { getDict, isLang, type Lang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n/meta";
import { LegalPage } from "@/components/sections/legal/legal-page";

export const generateMetadata = async ({ params }: PageProps<"/[lang]/privacy">) => ({
  ...(await pageMetadata(params, "privacy")),
  robots: { index: false },
});

// PLACEHOLDER: review with your own details before launch.
export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang: l } = await params;
  const lang: Lang = isLang(l) ? l : "en";
  const t = getDict(lang).legal;
  return (
    <LegalPage eyebrow={t.eyebrow} title={t.privacyTitle}>
      {t.privacy.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <p>
        {t.privacyDelete}{" "}
        <a className="text-phosphor underline underline-offset-4" href={`mailto:${SITE.email}`}>
          {SITE.email}
        </a>
        .
      </p>
    </LegalPage>
  );
}
