import fs from "fs";
import path from "path";

export type PostMeta = {
  slug: string;
  date: string;
  title: string;
  excerpt?: string;
};

export type Post = PostMeta & {
  html: string;
};

const POSTS_DIR = path.join(process.cwd(), "posts");

function filenameToSlug(fileName: string): string {
  return fileName.replace(/\.html?$/i, "");
}

function extractTitleFromHtml(html: string): string {
  // Try to extract first <h1> content, fallback to first title-like text
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) {
    return stripTags(h1Match[1]).trim();
  }
  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleTag) {
    return stripTags(titleTag[1]).trim();
  }
  return "Untitled";
}

function extractExcerptFromHtml(html: string, maxLen = 180): string {
  // Prefer first paragraph after the first h1, otherwise the very first paragraph
  let match =
    html.match(/<h1[^>]*>[\s\S]*?<\/h1>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i) ||
    html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  const text = stripTags((match && match[1]) || "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  return text.length > maxLen ? text.slice(0, maxLen - 1).trimEnd() + "…" : text;
}

function stripTags(s: string): string {
  return s.replace(/<[^>]*>/g, "");
}

export function getAllPostsMeta(): PostMeta[] {
  const files = fs.readdirSync(POSTS_DIR).filter((f: string) => f.endsWith(".html"));
  const metas = files.map((file: string) => {
    const filePath = path.join(POSTS_DIR, file);
    const html = fs.readFileSync(filePath, "utf8");
    const slug = filenameToSlug(file);
    // Date prefix like 2025-07-29-...
    const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] : "";
    const title = extractTitleFromHtml(html);
    const excerpt = extractExcerptFromHtml(html);
    return { slug, date, title, excerpt };
  });
  // Sort by date desc if available, otherwise by filename desc
  return metas.sort((a: PostMeta, b: PostMeta) =>
    a.date && b.date ? (a.date < b.date ? 1 : -1) : a.slug < b.slug ? 1 : -1
  );
}

export function getAllSlugs(): string[] {
  return getAllPostsMeta().map((m) => m.slug);
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.html`);
  if (!fs.existsSync(filePath)) return null;
  const html = fs.readFileSync(filePath, "utf8");
  const title = extractTitleFromHtml(html);
  const excerpt = extractExcerptFromHtml(html);
  const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : "";
  return { slug, date, title, excerpt, html };
}
