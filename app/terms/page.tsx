import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — GrantScope",
  description: "The terms that apply when you use GrantScope.",
};

export default function TermsPage() {
  return (
    <section className="card">
      <h1>Terms of Service</h1>
      <p className="muted">Last updated: November 26, 2026</p>

      <h2>What GrantScope is</h2>
      <p>
        GrantScope is a grant-information and tracking service. It keeps a
        curated registry of grant programs for builders on Base, Ethereum
        and BNB Smart Chain, a wallet tracker for funding transparency, and
        a feed of grant updates. GrantScope is operated by Okhiku Godwin
        (Nigeria) under the business name GrantScope.
      </p>

      <h2>Information is provided as-is</h2>
      <p>
        Grant program information on GrantScope — including statuses,
        amounts and deadlines — is provided as-is for discovery purposes.
        Every program listed is run by a third party, not by GrantScope.
        GrantScope does not guarantee that any application will be
        approved, that any amount shown will be awarded, or that any
        deadline shown is final. Programs can change or close their rounds
        at any time. Always verify program details on the official program
        page linked in the registry before applying.
      </p>

      <h2>GrantScope Pro</h2>
      <p>
        GrantScope Pro is a paid subscription that adds grant update
        alerts and deadline reminders. It is billed at $2 per week, $7 per
        month, or $70 per year, depending on the plan you choose. Card
        payments are billed through Paddle, which acts as the merchant of
        record for those payments. Bitcoin payments are also accepted and
        are confirmed manually. Cancelling and refunds are covered by our{" "}
        <a href="/refund">Refund Policy</a>.
      </p>

      <h2>Your responsibilities</h2>
      <p>
        You are responsible for checking grant details on the official
        program pages, for the accuracy of anything you submit to a grant
        program, and for your own applications. GrantScope is an
        information service only — it does not submit applications on your
        behalf and is not affiliated with the programs listed.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms:{" "}
        <a href="mailto:Okhikugodwin123@gmail.com">
          Okhikugodwin123@gmail.com
        </a>
      </p>
    </section>
  );
}
