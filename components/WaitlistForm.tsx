"use client";

import { useState } from "react";

// Waitlist submissions are delivered by FormSubmit to the project inbox.
// Swap this endpoint if the waitlist moves to another provider.
const WAITLIST_ENDPOINT =
  "https://formsubmit.co/ajax/Okhikugodwin123@gmail.com";

const CONTACT_EMAIL = "Okhikugodwin123@gmail.com";

type Status = "idle" | "sending" | "done" | "error";

export default function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          _subject: "GrantScope Pro waitlist",
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
        ✅ You&apos;re on the list. We&apos;ll email you the moment GrantScope
        Pro opens — founding waitlist members get the first invites.
      </p>
    );
  }

  return (
    <>
      <form className="waitlist-form" onSubmit={onSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
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
          {status === "sending" ? "Joining…" : "Join the waitlist"}
        </button>
      </form>
      {status === "error" && (
        <p className="error">
          Something went wrong sending that. Please email us directly at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and
          we&apos;ll add you to the list by hand.
        </p>
      )}
    </>
  );
}
