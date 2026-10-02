import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { SITE } from "@/lib/site";
import { getDict, localePath, type Lang } from "@/lib/i18n";

const linkCls = "link-u text-fern hover:text-phosphor";

export function Footer({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const L = (p: string) => localePath(lang, p);
  return (
    <footer className="border-t border-hairline py-12">
      <div className="wrap grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <span dir="ltr" className="inline-block">
            <Logo />
          </span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-fern-deep">{t.footer.tagline}</p>
        </div>
        <nav aria-label={t.footer.site}>
          <p className="eyebrow !text-fern-deep">{t.footer.site}</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link href={L("/")} className={linkCls}>
                {t.nav.home}
              </Link>
            </li>
            {t.NAV.map((l) => (
              <li key={l.href}>
                <Link href={L(l.href)} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={L("/pricing#faq")} className={linkCls}>
                {t.footer.faq}
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label={t.footer.services}>
          <p className="eyebrow !text-fern-deep">{t.footer.services}</p>
          <ul className="mt-4 space-y-3 text-sm">
            {t.SERVICES.map((s) => (
              <li key={s.cmd}>
                <Link href={L(`/services#${s.cmd}`)} className={linkCls}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="eyebrow !text-fern-deep">{t.footer.contact}</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link href={L("/start")} className={linkCls}>
                {t.footer.quote}
              </Link>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className={linkCls}>
                {SITE.email}
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className={linkCls}>
                WhatsApp
              </a>
            </li>
            <li>
              <Link href={localePath(lang === "ar" ? "en" : "ar", "/")} hrefLang={lang === "ar" ? "en" : "ar"} className={linkCls}>
                {t.nav.switchLabel}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6 font-mono text-xs text-fern-deep">
        <span>
          © {new Date().getFullYear()} {SITE.name}
        </span>
        <span className="flex gap-6">
          <Link href={L("/privacy")} className={linkCls}>
            {t.footer.privacy}
          </Link>
          <Link href={L("/terms")} className={linkCls}>
            {t.footer.terms}
          </Link>
        </span>
      </div>
    </footer>
  );
}
