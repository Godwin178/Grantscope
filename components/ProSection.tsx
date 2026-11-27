import WaitlistForm from "@/components/WaitlistForm";
import CopyAddress from "@/components/CopyAddress";
import SubscribeButton from "@/components/SubscribeButton";
import { PADDLE_PRICE_IDS } from "@/lib/paddle";

const PLANS = [
  {
    name: "Weekly",
    price: "$2",
    per: "/week",
    note: "Billed weekly",
    tag: null as string | null,
    priceId: PADDLE_PRICE_IDS.weekly,
    cta: "Subscribe — $2/week",
  },
  {
    name: "Monthly",
    price: "$7",
    per: "/month",
    note: "Billed monthly",
    tag: "Most popular",
    priceId: PADDLE_PRICE_IDS.monthly,
    cta: "Subscribe — $7/month",
  },
  {
    name: "Yearly",
    price: "$70",
    per: "/year",
    note: "Billed yearly — two months free vs monthly",
    tag: "Best value",
    priceId: PADDLE_PRICE_IDS.yearly,
    cta: "Subscribe — $70/year",
  },
];

const FEATURES = [
  {
    title: "⚡ Instant match alerts",
    body: "Get an email the moment a grant program matching your chains and ecosystem opens — or reopens — in the registry. No more checking ten foundation pages by hand.",
  },
  {
    title: "⏰ Deadline reminders",
    body: "Automatic reminders 7 days and 1 day before a program you're watching closes, so a deadline never slips past while you're busy building.",
  },
  {
    title: "🗂️ Application tracker",
    body: "Save the programs you're applying to and track each one's status — drafting, submitted, in review, decided — in one place.",
  },
  {
    title: "👀 Funding-wallet watch alerts",
    body: "Pro alerts for your watchlist: get notified when a funding wallet you track moves funds, instead of refreshing the explorer yourself.",
  },
];

const COMPARISON: { label: string; free: string; pro: string }[] = [
  { label: "Grant programs registry", free: "✓", pro: "✓" },
  { label: "Wallet tracker (Base, Ethereum, BNB Chain)", free: "✓", pro: "✓" },
  { label: "Funding-wallet watchlist (saved in your browser)", free: "✓", pro: "✓" },
  { label: "Instant alerts when a matching grant opens", free: "—", pro: "✓" },
  { label: "Deadline reminders (7 days & 1 day before close)", free: "—", pro: "✓" },
  { label: "Application tracker", free: "—", pro: "✓" },
  { label: "Funding-wallet movement alerts", free: "—", pro: "✓" },
];

const FAQS = [
  {
    q: "When does GrantScope Pro launch?",
    a: "Soon. We're opening Pro to the waitlist first, in small batches, so the alert system stays fast and accurate. Join the waitlist above and you'll get an invite email as soon as your batch opens.",
  },
  {
    q: "How does billing work?",
    a: "You pick the rhythm that suits you: $2 billed weekly, $7 billed monthly, or $70 billed yearly. All plans include every Pro feature. Subscriptions are billed via Paddle — click Subscribe on the plan you want and check out securely — and you can cancel anytime. Prefer crypto? Bitcoin is also accepted: see the “Pay with crypto” section above.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel in a couple of clicks whenever you like; you keep Pro until the end of the period you've already paid for, and the free registry and wallet tracker stay free forever.",
  },
  {
    q: "What does the free version include?",
    a: "Everything GrantScope does today: the curated grant programs registry, the live wallet tracker for Base, Ethereum and BNB Smart Chain, and the browser-saved funding-wallet watchlist. Pro adds alerts, reminders and tracking on top.",
  },
];

export default function ProSection() {
  return (
    <section id="pro">
      <section className="card">
        <span className="badge badge-open">GrantScope Pro — coming soon</span>
        <h2>Never miss a grant deadline again.</h2>
        <p className="muted">
          Grant programs open, pause and close with almost no notice — and the
          builders who hear first are usually the ones who get funded.
          GrantScope Pro watches the registry for you and taps you on the
          shoulder at the right moment.
        </p>
        <p>
          <a href="#waitlist" className="link-button primary-link">
            Join the waitlist
          </a>{" "}
          <span className="muted">
            From $2/week · cancel anytime · free version stays free
          </span>
        </p>
      </section>

      <section className="card">
        <h2>What Pro includes</h2>
        <div className="program-grid">
          {FEATURES.map((f) => (
            <article key={f.title} className="program">
              <h3>{f.title}</h3>
              <p className="muted">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Simple pricing</h2>
        <p className="muted">
          One plan, three billing options. Every option includes all Pro
          features — pick the rhythm that fits your budget.
        </p>
        <div className="program-grid">
          {PLANS.map((plan) => (
            <article key={plan.name} className="program plan">
              <div className="program-head">
                <h3>{plan.name}</h3>
                {plan.tag && <span className="badge badge-open">{plan.tag}</span>}
              </div>
              <p className="plan-price">
                {plan.price}
                <span className="plan-per">{plan.per}</span>
              </p>
              <p className="muted">{plan.note}</p>
              <p>
                <SubscribeButton priceId={plan.priceId} label={plan.cta} />
              </p>
            </article>
          ))}
        </div>
        <p className="muted">
          Billed securely via Paddle · cancel anytime — no lock-in, no
          cancellation fees.
        </p>
      </section>

      <section className="card">
        <h2>Pay with crypto</h2>
        <p className="muted">
          Prefer Bitcoin? BTC is accepted for all three plans — send the
          amount of BTC equal to $2 (weekly), $7 (monthly) or $70 (yearly)
          at the exchange rate at the time you pay, to this address:
        </p>
        <CopyAddress />
        <p className="muted">
          After paying, email{" "}
          <a href="mailto:Okhikugodwin123@gmail.com">
            Okhikugodwin123@gmail.com
          </a>{" "}
          with your payment transaction so we can switch Pro on for you.
          Crypto payments are confirmed manually, so activation isn&apos;t
          instant like card checkout.
        </p>
      </section>

      <section className="card">
        <h2>Free vs Pro</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Free</th>
                <th>Pro</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td>{row.free}</td>
                  <td>{row.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card" id="waitlist">
        <h2>Join the Pro waitlist</h2>
        <p className="muted">
          Pro is launching soon and the waitlist gets in first. Leave your
          email and we&apos;ll send your invite — plus the checkout link —
          the moment Pro opens.
        </p>
        <WaitlistForm />
      </section>

      <section className="card">
        <h2>Questions</h2>
        {FAQS.map((item) => (
          <div key={item.q} className="faq-item">
            <h3>{item.q}</h3>
            <p className="muted">{item.a}</p>
          </div>
        ))}
      </section>
    </section>
  );
}
