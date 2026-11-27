import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy — GrantScope",
  description: "How cancellations and refunds work for GrantScope Pro.",
};

export default function RefundPage() {
  return (
    <section className="card">
      <h1>Refund Policy</h1>
      <p className="muted">Last updated: November 26, 2026</p>

      <h2>Cancelling</h2>
      <p>
        You can cancel a GrantScope Pro subscription at any time. The
        subscription stays active until the end of the period you have
        already paid for, and it will not renew after that.
      </p>

      <h2>Refunds</h2>
      <p>
        A full refund is available on request within 14 days of any
        charge. To ask for one, email{" "}
        <a href="mailto:Okhikugodwin123@gmail.com">
          Okhikugodwin123@gmail.com
        </a>{" "}
        from the address connected to your subscription and say you would
        like a refund.
      </p>

      <h2>Bitcoin payments</h2>
      <p>
        Subscriptions paid in Bitcoin are refunded in the same way once
        the payment has been confirmed, minus the network fee charged to
        send the refund.
      </p>

      <h2>Contact</h2>
      <p>
        Refund and billing questions:{" "}
        <a href="mailto:Okhikugodwin123@gmail.com">
          Okhikugodwin123@gmail.com
        </a>
      </p>
    </section>
  );
}
