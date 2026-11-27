"use client";

import { useState } from "react";

// Alert signups are delivered by FormSubmit to the same project inbox as
// the waitlist (same endpoint as WaitlistForm's WAITLIST_ENDPOINT), but
// with a distinct _subject so alert signups can be told apart.
const ALERT_ENDPOINT =
  "https://formsubmit.co/ajax/Okhikugodwin123@gmail.com";

const CONTACT_EMAIL = "Okhikugodwin123@gmail.com";

type Status = "idle" | "sending" | "done" | "error";

export default function AlertForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(ALERT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          _subject: "GrantScope ALERT signup",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="notice">
        ✅ You&apos;re in. Every grant update will land in your inbox the
        moment we publish it.
      </p>
    );
  }

  return (
    <>
      <form className="waitlist-form" onSubmit={onSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <button
          type="submit"
          className="primary"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Signing up…" : "Get alerts"}
        </button>
      </form>
      {status === "error" && (
        <p className="error">
          Something went wrong sending that. Please email us directly at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and
          we&apos;ll add you to the alert list by hand.
        </p>
      )}
    </>
  );
}
