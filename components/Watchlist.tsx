"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CHAIN_LIST,
  CHAINS,
  ChainId,
  formatUnits,
  isValidAddress,
} from "@/lib/blockscout";
import { fetchAddressInfoWithFallback } from "@/lib/wallet";
import type { Selection } from "./WalletTracker";

export interface WatchEntry {
  address: string;
  label: string;
  chain: ChainId;
}

const STORAGE_KEY = "grantscope.watchlist.v1";

interface WatchlistProps {
  entries: WatchEntry[];
  onChange: (entries: WatchEntry[]) => void;
  onSelect: (sel: Selection) => void;
}

export default function Watchlist({ entries, onChange, onSelect }: WatchlistProps) {
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [refreshing, setRefreshing] = useState(false);

  const [addressInput, setAddressInput] = useState("");
  const [labelInput, setLabelInput] = useState("");
  const [chainInput, setChainInput] = useState<ChainId>("base");
  const [formError, setFormError] = useState<string | null>(null);

  const keyOf = (e: WatchEntry) => `${e.chain}:${e.address.toLowerCase()}`;

  const refreshBalances = useCallback(
    async (list: WatchEntry[]) => {
      if (list.length === 0) {
        setBalances({});
        return;
      }
      setRefreshing(true);
      const results = await Promise.allSettled(
        list.map((e) => fetchAddressInfoWithFallback(e.chain, e.address))
      );
      const next: Record<string, string> = {};
      list.forEach((entry, i) => {
        const r = results[i];
        next[keyOf(entry)] =
          r.status === "fulfilled"
            ? `${formatUnits(r.value.coinBalanceWei, 18)} ${CHAINS[entry.chain].nativeSymbol}`
            : "unavailable";
      });
      setBalances(next);
      setRefreshing(false);
    },
    []
  );

  useEffect(() => {
    void refreshBalances(entries);
  }, [entries, refreshBalances]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const address = addressInput.trim();
    if (!isValidAddress(address)) {
      setFormError("Invalid address — it should be 0x followed by 40 hex characters.");
      return;
    }
    if (entries.some((x) => x.chain === chainInput && x.address.toLowerCase() === address.toLowerCase())) {
      setFormError("That address is already on the watchlist for this chain.");
      return;
    }
    setFormError(null);
    onChange([
      ...entries,
      { address, label: labelInput.trim() || "Untitled wallet", chain: chainInput },
    ]);
    setAddressInput("");
    setLabelInput("");
  }

  function handleRemove(entry: WatchEntry) {
    onChange(entries.filter((x) => keyOf(x) !== keyOf(entry)));
  }

  return (
    <section className="card">
      <h2>Funding-wallet watchlist</h2>
      <p className="muted">
        Save grant-program or foundation wallets you want to keep an eye on.
        Entries are stored only in your browser (localStorage) — nothing is
        sent to a server.
      </p>

      {entries.length === 0 ? (
        <p className="muted">No wallets saved yet. Add one below, or track a wallet and use “Save to watchlist”.</p>
      ) : (
        <ul className="watchlist">
          {entries.map((entry) => (
            <li key={keyOf(entry)} className="watch-item">
              <button
                type="button"
                className="watch-main"
                onClick={() => onSelect({ address: entry.address, chain: entry.chain })}
                title="Open in wallet tracker"
              >
                <span className="watch-label">{entry.label}</span>
                <span className="mono muted">{entry.address}</span>
                <span className="muted">
                  {CHAINS[entry.chain].label} · {balances[keyOf(entry)] ?? "loading…"}
                </span>
              </button>
              <button
                type="button"
                className="remove"
                onClick={() => handleRemove(entry)}
                aria-label={`Remove ${entry.label}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
      {entries.length > 0 && (
        <button
          type="button"
          className="secondary"
          onClick={() => void refreshBalances(entries)}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing…" : "↻ Refresh balances"}
        </button>
      )}

      <form onSubmit={handleAdd} className="watch-form">
        <input
          type="text"
          value={labelInput}
          onChange={(e) => setLabelInput(e.target.value)}
          placeholder="Label (e.g. Example Foundation grants wallet)"
          aria-label="Label"
        />
        <input
          type="text"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          placeholder="0x… wallet address"
          spellCheck={false}
          aria-label="Wallet address"
        />
        <select
          value={chainInput}
          onChange={(e) => setChainInput(e.target.value as ChainId)}
          aria-label="Chain"
        >
          {CHAIN_LIST.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <button type="submit" className="primary">
          Add to watchlist
        </button>
      </form>
      {formError && <p className="error">{formError}</p>}
    </section>
  );
}

export function loadWatchlist(): WatchEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WatchEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e) =>
        e && typeof e.address === "string" && isValidAddress(e.address) &&
        (e.chain === "ethereum" || e.chain === "base" || e.chain === "bsc")
    );
  } catch {
    return [];
  }
}

export function saveWatchlist(entries: WatchEntry[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage unavailable (private mode etc.) — watchlist just won't persist.
  }
}
