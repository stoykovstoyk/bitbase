import Head from "next/head";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps } from "next";
import { getAllPostsMeta, type PostMeta } from "../../lib/posts";

const PAGE_SIZE = 5;

type Props = {
  posts: PostMeta[];
  page: number;
  totalPages: number;
};

export default function PagedHome({ posts, page, totalPages }: Props) {
  return (
    <>
      <Head>
        <title>BitBase {page}</title>
        <meta name="description" content={`Bitbase - Stay Secure. Stay Informed. ${page}`} />
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

        <section className="post-list">
          {posts.map((post) => (
            <article key={post.slug} className="post-card">
              <h2>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h2>
              {post.date && <time dateTime={post.date}>{post.date}</time>}
              {post.excerpt && (
                <p style={{ marginTop: 6, color: "var(--muted)" }}>{post.excerpt}</p>
              )}
            </article>
          ))}
        </section>

        <footer className="footer">© {new Date().getFullYear()} Cybersecurity News</footer>

        <nav aria-label="Pagination" className="pagination" style={{ marginTop: 24, display: "flex", gap: 8, justifyContent: "center" }}>
          {/* '<' goes to first page */}
          <Link
            href="/"
            aria-disabled={page === 1}
            style={{
              padding: "6px 10px",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 6,
              opacity: page === 1 ? 0.6 : 1
            }}
          >
            {"<"}
          </Link>

          {/* Window of 5 numbers centered around current page when possible */}
          {Array.from({ length: 5 }).map((_, i) => {
            const start = Math.min(Math.max(page - 2, 1), Math.max(totalPages - 4, 1));
            const p = start + i;
            if (p > totalPages) return null;
            const href = p === 1 ? "/" : `/page/${p}`;
            const isCurrent = p === page;
            return (
              <Link
                key={p}
                href={href}
                aria-current={isCurrent ? "page" : undefined}
                style={{
                  padding: "6px 10px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 6,
                  background: isCurrent ? "rgba(255,255,255,0.12)" : "transparent",
                  fontWeight: isCurrent ? 700 : 400
                }}
              >
                {p}
              </Link>
            );
          })}

          {/* '>' goes to last page */}
          <Link
            href={totalPages === 1 ? "/" : `/page/${totalPages}`}
            aria-disabled={page === totalPages}
            style={{
              padding: "6px 10px",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 6,
              opacity: page === totalPages ? 0.6 : 1
            }}
          >
            {">"}
          </Link>
        </nav>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const total = getAllPostsMeta().length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return {
    paths: Array.from({ length: totalPages - 1 }).map((_, i) => ({
      params: { n: String(i + 2) } // pages from 2..totalPages (page 1 is /)
    })),
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const n = Number(ctx.params?.n);
  const all = getAllPostsMeta();
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));

  // Guard invalid numbers just in case
  const page = Number.isFinite(n) && n >= 1 && n <= totalPages ? n : 1;

  const posts = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return { props: { posts, page, totalPages } };
};
