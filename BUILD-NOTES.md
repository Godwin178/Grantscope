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

## BNB Smart Chain support (added 2026-11-22)

GrantScope now tracks a third chain, BNB Smart Chain (chainId 56, native
BNB), in both the wallet tracker and the watchlist, so the project can be
presented to the BNB Chain Builder Grants program. The registry also
gained two entries: **BNB Chain Builder Grants** (open/rolling, up to
$200,000 per project, developer tooling & public goods —
https://www.bnbchain.org/en/grants) and **BNB Chain Kickstart** (active;
partner credits/services for builders).

**Data source** (`lib/blockscout.ts` + `lib/rpc.ts`), same pattern as Base:

- Blockscout stays the primary source: `https://bsc.blockscout.com/api/v2`.
  Verified 2026-11-22 from this VM: the instance does not answer API v2
  requests from datacenter IPs (every endpoint returns a plain
  "default backend - 404"), so from such networks BSC lookups run on the
  RPC fallback — exactly how Base behaves where its explorer is blocked.
  From a normal browser connection the explorer API remains primary.
- RPC fallback endpoints, in order: `https://bsc-dataseed.bnbchain.org`
  and `https://bsc-dataseed1.bnbchain.org` (both verified live with
  eth_blockNumber, block ~135,282,381), then
  `https://bsc-rpc.publicnode.com` (rate-limited from this VM's shared
  IP at check time; kept as a last resort, as with the other chains).
- Curated BSC token list — every contract verified live via eth_call
  (symbol + decimals) on 2026-11-22 before inclusion; all report
  **18 decimals** on BSC: USDT 0x55d398326f99059fF775485246999027B3197955,
  USDC 0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d,
  WBNB 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c,
  BUSD 0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56,
  CAKE 0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82 (on-chain symbol "Cake"),
  ETH 0x2170Ed0880ac9A755fd29B2688956BD959F933F8,
  DAI 0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3.

**Verification (2026-11-22, from this VM):**

- `npm run build` — **passed** with BSC wired through the tracker,
  watchlist (including its stored-entry chain validation), and registry
  (10 programs total).
- Smoke test of the BSC fallback lookup (native balance + all 7 curated
  balanceOf calls via the dataseed RPCs):
  - Binance hot wallet 0x8894E0a0c962CB723c1976a4421c95949bE2D4E3:
    2.999209 BNB; USDT 1,440.972199; USDC 83.000138; WBNB 3.141059;
    BUSD 3.000527; CAKE 3.000072; ETH 3.197507; DAI 3.000716.
  - BSC USDT contract 0x55d398326f99059fF775485246999027B3197955:
    0 BNB; USDT 10,885,344.895838; USDC 16,609.282727; WBNB 1.256126;
    BUSD 54,233.73637; CAKE 3,141.577563; ETH 3.216959; DAI 908.827777.
  - In both cases Blockscout BSC returned HTTP 404 from this network
    and the fallback engaged automatically, as designed.

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
