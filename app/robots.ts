import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Open to search engines and AI assistants alike: being quoted by ChatGPT, Claude,
// Perplexity or Gemini is how people find a web studio now. Remove a bot here to opt out.
const AI_BOTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-SearchBot", "Claude-User",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot-Extended", "Bingbot", "DuckAssistBot", "meta-externalagent", "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_BOTS, allow: "/" },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
