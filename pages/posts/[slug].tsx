import Head from "next/head";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps } from "next";
import { getAllPostsMeta, getAllSlugs, getPostBySlug, type Post } from "../../lib/posts";

type Props = {
  post: Post;
  prev?: { slug: string; title: string } | null;
  next?: { slug: string; title: string } | null;
};

export default function PostPage({ post, prev, next }: Props) {
  return (
    <>
      <Head>
        <title>{post.title} | BitBase </title>
        <meta name="description" content={post.title} />
      </Head>
      <main className="container">
        <header className="header">
          <div className="brand">
            <img src="/logo.png" alt="BitBase logo" width={48} height={48} />
            <div>
              <div className="brand-title">BitBase</div>
              <div className="brand-sub">Stay Secure. Stay Informed.</div>
            </div>
          </div>
        </header>

        {/* Top navigation bar */}
        <nav
          aria-label="Site navigation"
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 16
          }}
        >
          <Link
            href="/"
            style={{
              padding: "6px 10px",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 6
            }}
            title="Back to Home"
          >
            ← Home
          </Link>
          <div style={{ flex: 1 }} />
          <Link
            href="/page/2"
            style={{
              padding: "6px 10px",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 6
            }}
            title="Browse posts"
          >
            All Posts
          </Link>
        </nav>

        <article className="post-content">
          <header>
            <h1>{post.title}</h1>
            {post.date && <time dateTime={post.date}>{post.date}</time>}
          </header>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>

        {/* Prev/Next navigation */}
        <nav
          aria-label="Post navigation"
          style={{
            marginTop: 16,
            display: "flex",
            gap: 12,
            justifyContent: "space-between"
          }}
        >
          <div style={{ flex: 1 }}>
            {prev ? (
              <Link
                href={`/posts/${prev.slug}`}
                style={{
                  display: "inline-block",
                  padding: "10px 12px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 8
                }}
                title={prev.title}
              >
                ← {prev.title}
              </Link>
            ) : (
              <span style={{ color: "var(--muted)" }}>Start of posts</span>
            )}
          </div>
          <div style={{ flex: 1, textAlign: "right" }}>
            {next ? (
              <Link
                href={`/posts/${next.slug}`}
                style={{
                  display: "inline-block",
                  padding: "10px 12px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 8
                }}
                title={next.title}
              >
                {next.title} →
              </Link>
            ) : (
              <span style={{ color: "var(--muted)" }}>End of posts</span>
            )}
          </div>
        </nav>

        {/* Bottom CTA / Back to list */}
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link
            href="/"
            style={{
              padding: "8px 12px",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 8
            }}
          >
            Browse more posts
          </Link>
        </div>

        <footer className="footer">© {new Date().getFullYear()} Cybersecurity News</footer>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const slug = ctx.params?.slug as string;
  const post = getPostBySlug(slug);
  if (!post) {
    return { notFound: true };
  }

  // Build prev/next based on ordering from getAllPostsMeta (sorted desc by date)
  const all = getAllPostsMeta();
  const idx = all.findIndex((p) => p.slug === slug);
  const prevMeta = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null; // older post
  const nextMeta = idx > 0 ? all[idx - 1] : null; // newer post

  const prev = prevMeta ? { slug: prevMeta.slug, title: prevMeta.title } : null;
  const next = nextMeta ? { slug: nextMeta.slug, title: nextMeta.title } : null;

  return { props: { post, prev, next } };
};
