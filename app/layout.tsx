import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GrantScope — Grant & Funding Transparency for Base and Ethereum",
  description:
    "GrantScope is an open-source registry of grant programs and a live wallet tracker for funding transparency on Base and Ethereum.",
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
              Open grant &amp; funding transparency for Base and Ethereum.
            </p>
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
