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
