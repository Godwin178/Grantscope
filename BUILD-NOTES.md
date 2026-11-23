# GrantScope — Build Notes

Built 2026-11-22 as an MVP. Nothing has been deployed, no GitHub repo has
been created, and no grant application has been started.

## What was built

**GrantScope** — "Open grant & funding transparency for Base and Ethereum."
Next.js 15 + TypeScript (App Router), MIT license, minimal dependencies
(next, react, react-dom only).

Features, all working:

1. **Grant Programs registry** (home page) — curated data in
   `data/programs.json`, seeded with the 8 programs verified as of
   2026-11-22: Base Builder Grants (open, up to $5,000, live-on-Base
   required), Unichain Grants (open, up to $7,500), Ink Spark (open,
   $500–$20,000), Solana Foundation (open, rolling), Ethereum Foundation
   ESP (paused — no open wishlist/RFP items), Optimism Retro Funding
   (paused since Jan 2026), Superteam Instagrants (paused), Gitcoin Grants
   (between rounds — none since Oct 2025). Official links are included only
   where the URL was verified live during the build (ESP, Solana, Gitcoin,
   Uniswap Foundation, Superteam Earn); the rest are deliberately omitted
   rather than guessed.
2. **Wallet tracker** — paste any Ethereum/Base address → native balance +
   recent token transfers, fetched live client-side from the free public
   Blockscout APIs (eth.blockscout.com / base.blockscout.com, no API key).
   Invalid addresses and API errors produce plain-language messages.
3. **Funding-wallet watchlist** — save addresses with label + chain in
   localStorage, balances shown at a glance, refresh button, click an entry
   to open it in the tracker. Ships empty — no addresses were invented or
   pre-seeded.
4. **Report export** — "Download transfers (CSV)" button on every wallet
   view (timestamp, tx hash, token, from, to, value, direction).
5. **README.md** written for grant reviewers: public-good case, features,
   run instructions, and a priced roadmap aimed at a Base Builder Grant —
   M1 data reliability $1,400, M2 registry expansion $1,200, M3 alerts
   $1,200, M4 reporting $1,200 = **$5,000 total**. MIT `LICENSE` included.

## How to run locally

```bash
cd ~/workspace/grant-tracker
npm install   # already done during the build
npm run dev   # http://localhost:3000
# or production:
npm run build && npm run start
```

## Verification results

- `npm install` — OK (29 packages).
- `npm run build` — **passed** (Next.js 15.5.29, TypeScript checks passed,
  home page prerendered statically, ~107 kB first load).
- Production server smoke test — `npm run start` served the home page with
  HTTP 200; registry, wallet tracker, and watchlist UI all rendered.
- Blockscout API smoke tests (curl, Base USDC contract
  0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913):
  - `eth.blockscout.com` address + token-transfers endpoints — **OK**,
    returned live balance and transfer data.
  - `base.blockscout.com` — **could not be reached from this VM**
    (connection failure / Cloudflare challenge via curl). The app calls the
    same public API from the visitor's browser, where it is a normal open
    API; but Base lookups should be re-tested from a real browser after
    deployment, and if they misbehave, M1 (data reliability / fallback
    source) covers the fix.

## Base data fallback (added 2026-11-22)

**Problem:** the wallet tracker worked for Ethereum but failed for Base
with "Could not reach the Base explorer API." Root cause:
base.blockscout.com returns 403 / is unreachable from datacenter IPs
(verified from two networks), and there is no free no-key Base
transfer-history API reachable from such IPs (Etherscan V2 free tier
does not cover Base; free public Base RPCs cap eth_getLogs to tiny
ranges).

**Design** (`lib/rpc.ts` + `lib/wallet.ts`):

- Blockscout stays the primary source on both chains (balance +
  transfer history). It works from normal residential connections, and
  for Ethereum from everywhere.
- When the Blockscout fetch fails, the tracker falls back to plain
  JSON-RPC against public endpoints — Base: mainnet.base.org, then
  base-rpc.publicnode.com; Ethereum: ethereum-rpc.publicnode.com, then
  eth.llamarpc.com (one retry per endpoint). Native balance via
  eth_getBalance; token balances via eth_call balanceOf for a curated
  list (Base: USDC, USDbC, WETH, DAI, USDT, cbBTC, AERO; Ethereum:
  USDC, USDT, WETH, DAI).
- In fallback mode the UI shows the native balance and all non-zero
  token balances (or states that all tracked balances are zero), and
  the transfers section reads: "Transfer history is unavailable right
  now — showing live balances instead." The CSV button exports the
  balance list instead of transfers. The watchlist uses the same
  fallback for its balance lookups.

**Verification (2026-11-22, from this VM):**

- Every curated token contract (7 Base + 4 Ethereum) was called via
  balanceOf and returned a valid hex uint — all 11 valid. (Ethereum
  USDT/DAI initially flaked under publicnode throttling from this
  network; the per-endpoint retry resolved it and both re-verified.
  eth.llamarpc.com itself returns HTTP 525 from this VM — an egress
  quirk, not a contract problem.)
- Smoke test of the fallback functions against Base RPC for the Base
  USDC contract address (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913):
  native 0.0098 ETH; 6 of 7 token balances non-zero (USDbC 347.487004,
  USDT 554.011644, AERO 3,519.50002, cbBTC 0.015972, DAI 0.225153,
  WETH 0.00114). USDC itself reads 0 — confirmed on two independent
  RPCs: the contract holds none of its own token (its totalSupply is
  ~4.28B). End-to-end, `fetchWalletData` returns mode "balances" for
  Base from this network, as designed.
- `npm run build` passes with the fallback in place.

## Next steps (need Mcgrew)

1. **GitHub repo** — create a public repo under his account (Godwin178),
   e.g. `Godwin178/GrantScope`, and push this folder. (Not done — repo
   creation is his call.)
2. **Deploy** — import the repo into Vercel (same setup as Glassbox) so the
   app is live on a public URL. Base Builder Grants require the project to
   be **live on Base** — before applying, confirm what "live on Base"
   means for a read-only web app and whether deploying a small on-chain
   component is expected.
3. **Grant application details** — the Base Builder Grant form will need
   his name, contact email, and payout wallet; none of that is filled in
   anywhere yet.
4. Optional: put his name in the `LICENSE` copyright line (currently
   "GrantScope contributors").
