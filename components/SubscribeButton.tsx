"use client";

import { useState } from "react";
import { PADDLE_CLIENT_TOKEN } from "@/lib/paddle";

// Paddle.js is loaded lazily on the first Subscribe click, then reused.
// Production mode is the default for the live CDN script + a live_* token;
// we never call Paddle.Environment.set("sandbox").
const PADDLE_SCRIPT_SRC = "https://cdn.paddle.com/paddle/paddle.js";

interface PaddleGlobal {
  Initialize: (options: { token: string }) => void;
  Checkout: {
    open: (options: {
      items: { priceId: string; quantity: number }[];
    }) => void;
  };
}

declare global {
  interface Window {
    Paddle?: PaddleGlobal;
  }
}

let paddleReady: Promise<PaddleGlobal> | null = null;

function loadPaddle(): Promise<PaddleGlobal> {
  if (paddleReady) return paddleReady;
  paddleReady = (async () => {
    if (!window.Paddle) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = PADDLE_SCRIPT_SRC;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Paddle.js"));
        document.head.appendChild(script);
      });
    }
    const paddle = window.Paddle;
    if (!paddle) throw new Error("Paddle global missing after script load");
    paddle.Initialize({ token: PADDLE_CLIENT_TOKEN });
    return paddle;
  })();
  // If loading or init fails, forget the attempt so a later click can retry;
  // the click that failed still sees the rejection and falls back below.
  paddleReady.catch(() => {
    paddleReady = null;
  });
  return paddleReady;
}

function scrollToWaitlist() {
  document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
}

export default function SubscribeButton({
  priceId,
  label,
}: {
  priceId: string;
  label: string;
}) {
  const [opening, setOpening] = useState(false);

  async function onSubscribe() {
    setOpening(true);
    try {
      const paddle = await loadPaddle();
      paddle.Checkout.open({ items: [{ priceId, quantity: 1 }] });
    } catch {
      // Paddle.js blocked/unreachable or checkout failed to open (e.g. the
      // checkout domain is still in review) — never leave a dead button:
      // send the visitor to the waitlist instead.
      scrollToWaitlist();
    } finally {
      setOpening(false);
    }
  }

  return (
    <button
      type="button"
      className="primary"
      onClick={onSubscribe}
      disabled={opening}
    >
      {opening ? "Opening checkout…" : label}
    </button>
  );
}
