// /llms.txt: a plain-text brief of the business for AI assistants and answer engines
// (format: https://llmstxt.org). Built from the same copy as the site, so it never drifts.
import { SITE } from "@/lib/site";
import { en } from "@/lib/i18n/en";

export const dynamic = "force-static";

const url = (p: string) => `${SITE.url}${p === "/" ? "" : p}`;

export function GET() {
  const t = en;
  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${t.meta.description}`,
    "",
    `${t.hero.lead} Based in Egypt, working in English and Arabic. Prices are fixed and quoted in Egyptian pounds (${SITE.currency}).`,
    "",
    "## Pages",
    "",
    `- [Home](${url("/")}): what SiteCraft does, concept builds, services, process and FAQ`,
    `- [Work](${url("/work")}): ${t.meta.work.description}`,
    `- [Services](${url("/services")}): ${t.meta.services.description}`,
    `- [Process](${url("/process")}): ${t.meta.process.description}`,
    `- [Pricing](${url("/pricing")}): ${t.meta.pricing.description}`,
    `- [Get a quote](${url("/start")}): ${t.meta.start.description}`,
    `- [Arabic version](${url("/ar")}): the same site in Egyptian Arabic`,
    "",
    "## Services (starting prices)",
    "",
    ...t.SERVICES.map((s) => `- ${s.title}: from ${SITE.currency} ${s.from}. ${s.body} Includes: ${s.spec.join("; ")}.`),
    "",
    "## Plans",
    "",
    ...t.PACKAGES.map(
      (p) => `- ${p.name}: ${SITE.currency} ${p.price} (${p.note}). ${p.for} Includes: ${p.items.join("; ")}.`
    ),
    "",
    "## How it works",
    "",
    ...t.PROCESS.map((s, i) => `${i + 1}. ${s.title}: ${s.body}`),
    "",
    "## What every client gets",
    "",
    ...t.STACK_POINTS.map((s) => `- ${s.title}: ${s.body}`),
    "",
    "## Concept builds",
    "",
    ...t.WORK.map((w) => `- ${w.title} (${w.kind}): ${w.desc}`),
    "",
    "## FAQ",
    "",
    ...t.FAQ.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
    "## Contact",
    "",
    `- Quote form: ${url("/start")} (five questions, about two minutes, fixed quote by reply)`,
    `- Email: ${SITE.email}`,
    `- WhatsApp: https://wa.me/${SITE.whatsapp}`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
