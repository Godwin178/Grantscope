import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — GrantScope",
  description: "What GrantScope collects, and what it does not.",
};

export default function PrivacyPage() {
  return (
    <section className="card">
      <h1>Privacy Policy</h1>
      <p className="muted">Last updated: November 26, 2026</p>

      <h2>Email addresses</h2>
      <p>
        GrantScope collects an email address only when you submit one
        yourself through the waitlist form or the grant alert signup form
        on this site. Those addresses are used to send grant updates and
        information about GrantScope Pro. That is the only personal
        information the site itself asks for.
      </p>

      <h2>No analytics or advertising trackers</h2>
      <p>
        GrantScope runs no analytics and no advertising trackers. Browsing
        the registry, the wallet tracker and the updates feed does not
        require an account.
      </p>

      <h2>Payments</h2>
      <p>
        Card payments are processed by Paddle, which acts as the merchant
        of record. Paddle collects and handles your card data under its
        own privacy policy; GrantScope does not receive or store your card
        details. Bitcoin payments are handled manually and do not require
        personal details beyond what you choose to share so your payment
        can be matched to your subscription.
      </p>

      <h2>Your email is never sold</h2>
      <p>
        Email addresses collected by GrantScope are never sold. You can
        ask for your email address to be removed at any time by writing to{" "}
        <a href="mailto:Okhikugodwin123@gmail.com">
          Okhikugodwin123@gmail.com
        </a>
        , and it will be deleted from the mailing list.
      </p>

      <h2>Contact</h2>
      <p>
        Privacy questions:{" "}
        <a href="mailto:Okhikugodwin123@gmail.com">
          Okhikugodwin123@gmail.com
        </a>
      </p>
    </section>
  );
}
