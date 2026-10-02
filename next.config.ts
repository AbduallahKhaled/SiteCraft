import type { NextConfig } from "next";
import path from "node:path";

// Images in /public keep their names between deploys, so cache them for a week
// and let the CDN refresh them in the background after that.
const assetCache = "public, max-age=604800, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  turbopack: { root: path.resolve(__dirname) },
  poweredByHeader: false,
  reactStrictMode: true,
  // English lives at "/" without a prefix: serve it from app/[lang] with lang = "en".
  // Arabic is served directly at /ar/... ; /en/... redirects to the clean URL.
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
  async rewrites() {
    return [
      { source: "/", destination: "/en" },
      { source: "/:page(work|services|process|pricing|start|privacy|terms)", destination: "/en/:page" },
    ];
  },
  async headers() {
    return [
      { source: "/work/:file*", headers: [{ key: "Cache-Control", value: assetCache }] },
      { source: "/hero/:file*", headers: [{ key: "Cache-Control", value: assetCache }] },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
