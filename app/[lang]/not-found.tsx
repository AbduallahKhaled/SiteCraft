"use client";
// Rendered inside the [lang] layout; reads the language from the URL.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDict, localePath, type Lang } from "@/lib/i18n";

export default function NotFound() {
  const path = usePathname();
  const lang: Lang = path === "/ar" || path.startsWith("/ar/") ? "ar" : "en";
  const t = getDict(lang).notFound;
  return (
    <section className="wrap flex min-h-[70vh] flex-col items-start justify-center pt-24">
      <p className="font-mono text-sm text-sage-dim" dir="ltr">
        <span className="text-fern">$</span> sitecraft open this-page
      </p>
      <p className="mt-2 font-mono text-sm text-destructive" dir="ltr">
        {t.error}
      </p>
      <h1 className="mt-8 text-5xl tracking-[-0.02em] sm:text-6xl">{t.title}</h1>
      <p className="lead mt-6 max-w-xl">{t.body}</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href={localePath(lang, "/start")} className="btn-lime">
          {t.cta}
        </Link>
        <Link href={localePath(lang, "/")} className="btn-ghost">
          {t.home}
        </Link>
      </div>
    </section>
  );
}
