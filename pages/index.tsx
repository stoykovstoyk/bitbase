import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import { getAllPostsMeta, type PostMeta } from "../lib/posts";

type Props = {
  posts: PostMeta[];
};

export default function Home({ posts }: Props) {
  return (
    <>
      <Head>
        <title>Tech Blog</title>
        <meta name="description" content="Tech Blog powered by Next.js" />
      </Head>
      <main className="container">
        <header className="header">
          <div className="brand">
            <img src="/favicon.ico" alt="" width={20} height={20} />
            <div>
              <div className="brand-title">Tech Blog</div>
              <div className="brand-sub">Next.js static site</div>
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
            </article>
          ))}
        </section>

        <footer className="footer">© {new Date().getFullYear()} Tech Blog</footer>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = getAllPostsMeta();
  return { props: { posts } };
};
