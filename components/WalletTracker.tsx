"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CHAIN_LIST,
  CHAINS,
  ChainId,
  AddressInfo,
  TokenTransfer,
  downloadTransfersCsv,
  formatUnits,
  isValidAddress,
} from "@/lib/blockscout";
import {
  downloadBalancesCsv,
  fetchWalletData,
} from "@/lib/wallet";
import type { TokenBalance } from "@/lib/rpc";

export interface Selection {
  address: string;
  chain: ChainId;
}

interface WalletTrackerProps {
  selection: Selection | null;
  onSelect: (sel: Selection) => void;
  onAddToWatchlist: (sel: Selection) => void;
}

export default function WalletTracker({
  selection,
  onSelect,
  onAddToWatchlist,
}: WalletTrackerProps) {
  const [addressInput, setAddressInput] = useState("");
  const [chainInput, setChainInput] = useState<ChainId>("base");
  const [formError, setFormError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [info, setInfo] = useState<AddressInfo | null>(null);
  const [transfers, setTransfers] = useState<TokenTransfer[]>([]);
  /** Non-null only in RPC fallback mode (explorer API unreachable). */
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[] | null>(null);

  const load = useCallback(async (sel: Selection) => {
    setLoading(true);
    setLoadError(null);
    setInfo(null);
    setTransfers([]);
    setTokenBalances(null);
    try {
      const data = await fetchWalletData(sel.chain, sel.address);
      setInfo(data.info);
      if (data.mode === "full") {
        setTransfers(data.transfers);
      } else {
        setTokenBalances(data.tokenBalances);
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selection) {
      setAddressInput(selection.address);
      setChainInput(selection.chain);
      void load(selection);
    }
  }, [selection, load]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const address = addressInput.trim();
    if (!isValidAddress(address)) {
      setFormError("That does not look like a valid address. It should be 0x followed by 40 hex characters.");
      return;
    }
    setFormError(null);
    onSelect({ address, chain: chainInput });
  }

  const activeChain = selection ? CHAINS[selection.chain] : null;

  return (
    <section className="card">
      <h2>Wallet tracker</h2>
      <p className="muted">
        Paste any Ethereum or Base address to see its native balance and recent
        token transfers, fetched live from the public Blockscout explorer APIs.
        If an explorer API is unreachable, balances are read directly from the
        chain via public RPC instead.
      </p>
      <form onSubmit={handleSubmit} className="tracker-form">
        <input
          type="text"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          placeholder="0x… wallet address"
          spellCheck={false}
          className="address-input"
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
          Track wallet
        </button>
      </form>
      {formError && <p className="error">{formError}</p>}

      {loading && <p className="muted">Loading on-chain data…</p>}
      {loadError && <p className="error">{loadError}</p>}

      {info && activeChain && selection && (
        <div className="wallet-view">
          <div className="wallet-head">
            <div>
              <div className="mono break-all">{info.hash}</div>
              <div className="muted">
                {activeChain.label}
                {tokenBalances === null &&
                  (info.isContract ? " · contract" : " · externally owned account")}
                {info.name ? ` · ${info.name}` : ""}
              </div>
            </div>
            <div className="balance">
              <span className="balance-value">
                {formatUnits(info.coinBalanceWei, 18)} {activeChain.nativeSymbol}
              </span>
              <span className="muted">native balance</span>
            </div>
          </div>

          <div className="wallet-actions">
            <button
              type="button"
              onClick={() => onAddToWatchlist(selection)}
              className="secondary"
            >
              ★ Save to watchlist
            </button>
            {tokenBalances !== null ? (
              <button
                type="button"
                onClick={() =>
                  downloadBalancesCsv(selection.address, selection.chain, info.coinBalanceWei, tokenBalances)
                }
                className="secondary"
              >
                ⬇ Download balances (CSV)
              </button>
            ) : (
              <button
                type="button"
                onClick={() => downloadTransfersCsv(selection.address, selection.chain, transfers)}
                className="secondary"
                disabled={transfers.length === 0}
              >
                ⬇ Download transfers (CSV)
              </button>
            )}
            <a
              href={`${activeChain.explorerBase}/address/${info.hash}`}
              target="_blank"
              rel="noreferrer"
              className="secondary link-button"
            >
              View in explorer ↗
            </a>
          </div>

          {tokenBalances !== null ? (
            <>
              <h3>Token balances</h3>
              {tokenBalances.filter((t) => t.rawBalance !== "0").length === 0 ? (
                <p className="muted">
                  All tracked token balances are zero for this address on {activeChain.label}.
                </p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Token</th>
                        <th>Balance</th>
                        <th>Contract</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokenBalances
                        .filter((t) => t.rawBalance !== "0")
                        .map((t) => (
                          <tr key={t.address}>
                            <td>{t.symbol}</td>
                            <td className="nowrap">{formatUnits(t.rawBalance, t.decimals)}</td>
                            <td className="mono">{shorten(t.address)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
              <h3>Recent token transfers</h3>
              <p className="muted">
                Transfer history is unavailable right now — showing live balances instead.
              </p>
            </>
          ) : (
            <>
              <h3>Recent token transfers ({transfers.length})</h3>
              {transfers.length === 0 ? (
            <p className="muted">No token transfers found for this address on {activeChain.label}.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Time (UTC)</th>
                    <th>Token</th>
                    <th>Value</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Tx</th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.map((t, i) => (
                    <tr key={`${t.transactionHash}-${i}`}>
                      <td className="nowrap">{t.timestamp.replace("T", " ").replace(".000000Z", "Z")}</td>
                      <td>{t.tokenSymbol}</td>
                      <td className="nowrap">{formatUnits(t.value, t.decimals)}</td>
                      <td className="mono">{shorten(t.from)}</td>
                      <td className="mono">{shorten(t.to)}</td>
                      <td className="mono">
                        <a
                          href={`${activeChain.explorerBase}/tx/${t.transactionHash}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {shorten(t.transactionHash)}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
            </>
          )}
        </div>
      )}
    </section>
  );
}

function shorten(hash: string): string {
  if (hash.length <= 13) return hash;
  return `${hash.slice(0, 6)}…${hash.slice(-4)}`;
}
