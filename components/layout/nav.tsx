"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Translate } from "@phosphor-icons/react";
import { Logo } from "@/components/brand/logo";
import { getDict, localePath, stripLang, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ScrollProgress } from "@/components/effects/motion-fx";

export function Nav({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const [open, setOpen] = useState(false);
  const fullPath = usePathname();
  const path = stripLang(fullPath); // "/ar/work" -> "/work"
  const L = (p: string) => localePath(lang, p);
  const other: Lang = lang === "ar" ? "en" : "ar";

  // close the menu on Escape (links close it on click); lock page scroll while it is open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(href + "/"));
  const switchLink = (
    <Link
      href={localePath(other, path)}
      hrefLang={other}
      lang={other}
      aria-label={t.nav.switchAria}
      onClick={() => setOpen(false)}
      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-circuit px-3 text-sm font-medium text-moss-bright transition-colors duration-200 ease-out hover:border-moss hover:text-phosphor"
    >
      <Translate className="size-4" aria-hidden />
      {t.nav.switchLabel}
    </Link>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-void/80 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] backdrop-blur-[10px]">
        <div className="wrap flex h-16 items-center justify-between gap-4">
          <Link href={L("/")} aria-label={t.nav.homeAria} dir="ltr">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-hairline bg-void/40 p-1 md:flex" aria-label={t.nav.main}>
            {t.NAV.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={L(l.href)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-[color,background-color,box-shadow] duration-200 ease-out",
                    active ? "bg-ground text-phosphor ring-1 ring-circuit" : "text-fern hover:text-phosphor"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex">{switchLink}</span>
            <Link
              href={L("/start")}
              aria-current={isActive("/start") ? "page" : undefined}
              className={cn(
                "hidden h-10 items-center rounded-xl border px-4 text-sm font-semibold transition-colors duration-200 ease-out sm:inline-flex",
                isActive("/start") ? "border-lime text-lime" : "border-circuit text-phosphor hover:border-moss"
              )}
            >
              {t.nav.quote}
            </Link>
            <button
              type="button"
              className={cn(
                "relative inline-flex size-10 items-center justify-center rounded-xl border text-phosphor transition-colors duration-200 md:hidden",
                open ? "border-circuit bg-ground" : "border-hairline bg-void/60"
              )}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? t.nav.close : t.nav.open}
              onClick={() => setOpen((v) => !v)}
            >
              {/* hamburger lines morph into an X */}
              <span
                className={cn(
                  "ease-fluid absolute h-px w-5 bg-current transition-transform duration-500",
                  open ? "rotate-45" : "-translate-y-1.5"
                )}
              />
              <span
                className={cn(
                  "ease-fluid absolute h-px w-5 bg-current transition-transform duration-500",
                  open ? "-rotate-45" : "translate-y-1.5"
                )}
              />
            </button>
          </div>
        </div>
        <ScrollProgress />
      </header>

      {/* Mobile menu. Lives outside <header>: the header's backdrop-filter would trap a fixed child inside its 64px box. */}
      <div
        className={cn(
          "ease-fluid fixed inset-0 top-16 z-40 bg-void/70 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <div
        id="mobile-nav"
        className={cn(
          "ease-fluid fixed inset-x-3 top-[4.5rem] z-50 max-h-[calc(100svh-5.5rem)] overflow-y-auto rounded-2xl border border-circuit bg-ground p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] transition-[opacity,transform] duration-300 md:hidden",
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        )}
        aria-hidden={!open}
        inert={!open}
      >
        <nav className="flex flex-col" aria-label={t.nav.mobile}>
          {[{ href: "/", label: t.nav.home }, ...t.NAV].map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={L(l.href)}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3.5 text-lg font-medium transition-colors duration-200",
                  active ? "bg-void text-lime" : "text-phosphor hover:bg-void"
                )}
              >
                {l.label}
                {active && <span className="size-1.5 rounded-full bg-lime" aria-hidden />}
              </Link>
            );
          })}
        </nav>
        <div className="mt-2 grid grid-cols-2 gap-2 border-t border-hairline p-2 pt-4">
          {switchLink}
          <Link href={L("/start")} onClick={() => setOpen(false)} className="btn-lime !h-10 !px-3 !py-0 text-sm">
            {t.nav.quote}
          </Link>
        </div>
      </div>
    </>
  );
}
