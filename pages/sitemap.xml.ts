import type { GetServerSideProps } from "next";
import { getAllPostsMeta } from "../lib/posts";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "http://localhost:3000";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts = getAllPostsMeta();

  type UrlEntry = {
    loc: string;
    changefreq?: string;
    priority?: string;
    lastmod?: string;
  };

  const urls: UrlEntry[] = [
    { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0" },
    // Paginated index pages (1 post per page)
    ...(() => {
      const totalPages = Math.max(1, Math.ceil(posts.length / 1));
      const pages = [];
      for (let i = 2; i <= totalPages; i++) {
        pages.push({
          loc: `${SITE_URL}/page/${i}`,
          changefreq: "weekly",
          priority: "0.6"
        });
      }
      return pages;
    })(),
    // Individual post pages
    ...posts.map((p) => ({
      loc: `${SITE_URL}/posts/${p.slug}`,
      lastmod: p.date ? new Date(p.date).toISOString() : undefined,
      changefreq: "monthly",
      priority: "0.8"
    }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => {
    const lastmod = u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : "";
    const changefreq = u.changefreq ? `\n    <changefreq>${u.changefreq}</changefreq>` : "";
    const priority = u.priority ? `\n    <priority>${u.priority}</priority>` : "";
    return `  <url>
    <loc>${u.loc}</loc>${lastmod}${changefreq}${priority}
  </url>`;
  })
  .join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  // This page does not render; it only streams XML in getServerSideProps.
  return null;
}
