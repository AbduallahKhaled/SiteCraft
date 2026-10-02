# SiteCraft 2

Working copy of the SiteCraft site (the original lives in `../sitecraft`). Next.js 16, Tailwind 4, English + Arabic.

```bash
npm run dev -- -p 3201
```

## Pages

| URL | What it is for |
| --- | --- |
| `/` | Short version of the whole story. Each block links to the page that goes deeper. |
| `/work` | The 8 concept builds. |
| `/services` | The 6 project types with starting prices, plus a 3-step summary. |
| `/process` | The 5-step timeline and the tools we use. |
| `/pricing` | The 3 plans and the FAQ. |
| `/start` | The quote form (the main call to action on every page). |
| `/privacy`, `/terms` | Legal pages, not indexed. |

Arabic versions live under `/ar/...`. English has no prefix (see `next.config.ts` rewrites; **add new pages there**).

## Where things live

```
app/[lang]/            one folder per page; (legal)/ groups privacy + terms
components/
  layout/              nav, footer (on every page)
  sections/
    home/              blocks used only on the home page
    services/ process/ pricing/ work/ start/ legal/   blocks for that page
    shared/            page-header, cta-band, steps, faq (used on several pages)
  ui/                  reusable widgets (x-ray lens, code sphere, compare slider, work rail...)
  effects/             site-wide scroll reveal + motion
  brand/               logo
  seo/                 JSON-LD script tag
lib/
  i18n/en.ts, ar.ts    every word on the site (ar mirrors en)
  i18n/meta.ts         page titles and social previews
  schema.ts            structured data for Google and AI assistants
  site.ts              business settings (domain, WhatsApp, email)
tools/                 scripts that render screenshots and mockups into public/
```

Adding a page: create `app/[lang]/<name>/page.tsx`, add copy + `meta.<name>` to both `en.ts` and `ar.ts`, then add it to `NAV`, `next.config.ts`, `app/sitemap.ts` and `app/llms.txt/route.ts`.
