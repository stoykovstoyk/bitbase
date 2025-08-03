import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "posts");
const PUBLIC_DIR = path.join(ROOT, "public");

// 1) Determine base URL
const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

// 2) Collect posts from posts/ (HTML files)
function readPostsMeta() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".html"));
  const metas = files.map((file) => {
    const slug = file.replace(/\.html?$/i, "");
    const m = slug.match(/^(\d{4}-\d{2}-\d{2})/);
    const date = m ? m[1] : "";
    return { slug, date };
  });
  // Sort newest first
  metas.sort((a, b) => (a.date && b.date ? (a.date < b.date ? 1 : -1) : a.slug < b.slug ? 1 : -1));
  return metas;
}

function buildUrls(metas) {
  const PAGE_SIZE = 1;
  const totalPages = Math.max(1, Math.ceil(metas.length / PAGE_SIZE));

  const urls = [
    { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0" },
    // paginated index pages (2..N)
    ...Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
      loc: `${SITE_URL}/page/${i + 2}`,
      changefreq: "weekly",
      priority: "0.6"
    })),
    // individual post pages
    ...metas.map((m) => ({
      loc: `${SITE_URL}/posts/${m.slug}`,
      lastmod: m.date ? new Date(m.date).toISOString() : undefined,
      changefreq: "monthly",
      priority: "0.8"
    }))
  ];

  return urls;
}

function toXml(urls) {
  const body = urls
    .map((u) => {
      const lastmod = u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : "";
      const changefreq = u.changefreq ? `\n    <changefreq>${u.changefreq}</changefreq>` : "";
      const priority = u.priority ? `\n    <priority>${u.priority}</priority>` : "";
      return `  <url>
    <loc>${u.loc}</loc>${lastmod}${changefreq}${priority}
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

function main() {
  const metas = readPostsMeta();
  const urls = buildUrls(metas);
  const xml = toXml(urls);

  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR);
  const outFile = path.join(PUBLIC_DIR, "sitemap.xml");
  fs.writeFileSync(outFile, xml, "utf8");
  console.log(`Generated ${outFile} with ${urls.length} URLs`);
}

main();
