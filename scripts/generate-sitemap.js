import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import events from "../src/data/events.json" with { type: "json" };

const SITE_URL = "https://www.ldsgct.org";
const today = new Date().toISOString().slice(0, 10);

const staticRoutes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/events", changefreq: "weekly", priority: "0.9" },
  { path: "/team", changefreq: "monthly", priority: "0.5" },
  { path: "/register", changefreq: "weekly", priority: "0.8" },
];

const eventRoutes = events.map((event) => ({
  path: `/events/${event.slug}`,
  changefreq: "weekly",
  priority: "0.7",
}));

const urls = [...staticRoutes, ...eventRoutes];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${SITE_URL}${url.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const outPath = fileURLToPath(new URL("../public/sitemap.xml", import.meta.url));
writeFileSync(outPath, xml);
console.log(`sitemap.xml written with ${urls.length} URLs`);
