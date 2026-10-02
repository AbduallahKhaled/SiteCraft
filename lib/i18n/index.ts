// Two languages: English at "/", Arabic at "/ar". English URLs have no prefix
// (next.config.ts rewrites them to app/[lang] with lang = "en").
import { en } from "./en";
import { ar } from "./ar";

export type { Option } from "./en";
export type Lang = "en" | "ar";
export type Dict = typeof en;

export const LANGS: Lang[] = ["en", "ar"];
export const isLang = (v: string): v is Lang => v === "en" || v === "ar";
export const getDict = (lang: Lang): Dict => (lang === "ar" ? ar : en);
export const dirOf = (lang: Lang) => (lang === "ar" ? "rtl" : "ltr");

/** "/pricing" in the given language: "/pricing" or "/ar/pricing". Keeps #hash and ?query. */
export const localePath = (lang: Lang, path: string) =>
  lang === "en" ? path : path === "/" ? "/ar" : /^\/[?#]/.test(path) ? `/ar${path.slice(1)}` : `/ar${path}`;

/** Path without the language prefix: "/ar/work" -> "/work", "/ar" -> "/". */
export const stripLang = (path: string) => (path === "/ar" ? "/" : path.startsWith("/ar/") ? path.slice(3) : path);
