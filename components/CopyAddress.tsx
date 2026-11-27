"use client";

import { useState } from "react";

// GrantScope Pro Bitcoin payment address — the project owner's own wallet.
// Crypto payments are confirmed manually by email (see the Pro section).
const BTC_ADDRESS = "bc1qqjjtaugg40vyjzhddx7mte8ahear0l644g2g9j";

export default function CopyAddress() {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(BTC_ADDRESS);
      setCopied(true);
    } catch {
      // Clipboard unavailable — the address stays visible and selectable.
      setCopied(false);
    }
  }

  return (
    <p>
      <span className="mono break-all">{BTC_ADDRESS}</span>{" "}
      <button type="button" onClick={onCopy}>
        {copied ? "Copied ✓" : "Copy address"}
      </button>
    </p>
  );
}
