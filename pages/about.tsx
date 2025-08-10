import Head from "next/head";
import Link from "next/link";

export default function About() {
  return (
    <>
      <Head>
        <title>About - BitBase</title>
        <meta name="description" content="About BitBase" />
      </Head>
      <main className="container">
        <header className="header">
          <div className="brand" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/logo.png" alt="BitBase logo" width={48} height={48} />
            <div>
              <div className="brand-title">BitBase</div>
              <div className="brand-sub">Stay Secure. Stay Informed.</div>
            </div>
          </div>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
          </nav>
        </header>

        <section className="post-content">
          <h1>About BitBase</h1>
          <p>BitBase is a cybersecurity news website dedicated to providing the latest information and insights on cybersecurity threats, vulnerabilities, and best practices. Our mission is to help individuals and organizations stay secure and informed in the ever-evolving digital landscape.</p>
          <p>We cover a wide range of topics, including ransomware, malware, phishing, data breaches, and more.</p>
        </section>

        <footer className="footer">© {new Date().getFullYear()} Cybersecurity News</footer>
      </main>
    </>
  );
}
