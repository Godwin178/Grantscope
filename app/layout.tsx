import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GrantScope — Grant & Funding Transparency for Base, Ethereum and BNB Smart Chain",
  description:
    "GrantScope is an open-source registry of grant programs and a live wallet tracker for funding transparency on Base, Ethereum and BNB Smart Chain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container">
            <div className="brand">🔭 GrantScope</div>
            <p className="tagline">
              Open grant &amp; funding transparency for Base, Ethereum and
              BNB Smart Chain.
            </p>
            <nav className="site-nav">
              <a href="/">Registry &amp; tracker</a>
              <a href="/pro" className="nav-pro">
                Go Pro ⭐
              </a>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="site-footer">
          <div className="container muted">
            GrantScope is free and open source (MIT). Data comes from the
            public Blockscout explorer APIs. Grant program statuses are
            curated and dated — always confirm details on the program&apos;s
            official page before applying.
          </div>
        </footer>
      </body>
    </html>
  );
}
