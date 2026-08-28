import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ANNUAL_SEO,
  WAR_SEO,
  absUrl,
  patchSeoHtml,
} from "./seo-config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");

const origin = (process.env.VITE_SITE_URL || "").replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);

const indexHtml = readFileSync(join(DIST, "index.html"), "utf8");

mkdirSync(join(DIST, "war"), { recursive: true });

writeFileSync(join(DIST, "index.html"), patchSeoHtml(indexHtml, ANNUAL_SEO, origin));
writeFileSync(join(DIST, "404.html"), readFileSync(join(DIST, "index.html"), "utf8"));
writeFileSync(
  join(DIST, "war", "index.html"),
  patchSeoHtml(indexHtml, WAR_SEO, origin),
);

const urls = [ANNUAL_SEO, WAR_SEO].map((seo) => {
  const loc = absUrl(origin, seo.path === "/" ? "/" : seo.path);
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${seo.path === "/" ? "1.0" : "0.9"}</priority>
  </url>`;
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

writeFileSync(join(DIST, "sitemap.xml"), sitemap);

const robots = origin
  ? `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`
  : `User-agent: *
Allow: /
`;

writeFileSync(join(DIST, "robots.txt"), robots);

console.log("[seo] wrote dist/sitemap.xml, dist/robots.txt, dist/404.html, dist/war/index.html");
