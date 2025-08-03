import Head from "next/head";
import type { GetStaticPaths, GetStaticProps } from "next";
import { getAllSlugs, getPostBySlug, type Post } from "../../lib/posts";

type Props = {
  post: Post;
};

export default function PostPage({ post }: Props) {
  return (
    <>
      <Head>
        <title>{post.title} | Tech Blog</title>
        <meta name="description" content={post.title} />
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

        <article className="post-content">
          <header>
            <h1>{post.title}</h1>
            {post.date && <time dateTime={post.date}>{post.date}</time>}
          </header>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>

        <footer className="footer">© {new Date().getFullYear()} Tech Blog</footer>
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
  return { props: { post } };
};
