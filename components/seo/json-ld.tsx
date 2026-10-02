import { ldJson } from "@/lib/schema";

/** schema.org JSON-LD for search engines and AI answer engines. */
export function JsonLd({ graph }: { graph: object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(graph) }} />;
}
