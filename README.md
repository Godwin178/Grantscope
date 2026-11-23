# GrantScope

**Open grant & funding transparency for Base, Ethereum and BNB Smart Chain.**

GrantScope helps builders and communities answer two simple questions:

1. **Which grant programs are actually open right now?**
2. **Where did the grant money go?**

It combines a hand-verified registry of grant programs with a live,
no-signup wallet tracker for any Ethereum, Base or BNB Smart Chain
address — so anyone can
follow public funding wallets and check that grant money moves the way
programs say it does.

## The public good

Grant programs distribute public and ecosystem funds, but their money is
hard to follow: program statuses change quietly (rounds pause, forms close),
and disbursement wallets are scattered across explorers. GrantScope is a
free, open-source transparency layer for that funding:

- **No dead ends.** The registry records *paused* and *between-rounds*
  programs honestly, with the date each status was verified, instead of
  sending builders to closed application forms.
- **Follow the money.** Any funding wallet can be inspected in the browser —
  balance and token transfers — and exported as a CSV report anyone can
  audit, with no account, no API key, and no tracking.
- **Open by default.** MIT-licensed code and a plain JSON data file for the
  registry that anyone can fork, correct, and extend.

## Features

- **Grant Programs registry** — curated programs (Base Builder Grants,
  Ethereum Foundation ESP, Gitcoin Grants, Unichain Grants, Ink Spark,
  Optimism Retro Funding, Solana Foundation, Superteam Instagrants,
  BNB Chain Builder Grants, BNB Chain Kickstart) with
  chain, funder, status, amounts, and verification dates. Data lives in
  [`data/programs.json`](data/programs.json) and is trivial to edit.
- **Wallet tracker** — paste any Ethereum, Base or BNB Smart Chain address
  to see its native
  balance and recent token transfers, fetched live from the free public
  [Blockscout](https://www.blockscout.com) APIs (`eth.blockscout.com`,
  `base.blockscout.com`, `bsc.blockscout.com`). No API key required. Where
  an explorer API is unreachable, the tracker falls back to live balances
  from public RPC endpoints (for BNB Smart Chain:
  `bsc-dataseed.bnbchain.org`). Invalid addresses and API
  errors are handled gracefully.
- **Funding-wallet watchlist** — save addresses with a label and chain,
  stored in your browser's localStorage, with each wallet's balance at a
  glance. Nothing is sent to a server.
- **Report export** — download any wallet's transfer list as a CSV file
  from its wallet view.

## Run it locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev     # development server on http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

## Tech

Next.js + TypeScript (App Router), with data fetched client-side from the
Blockscout API v2. No database, no accounts, no environment variables, no
API keys.

## Roadmap — Base Builder Grant application

GrantScope is built and maintained as a public good. The roadmap below is
scoped to a **Base Builder Grant (total ask: $5,000)**, with payment tied to
delivered milestones:

| Milestone | Deliverable | Amount |
| --- | --- | --- |
| **M1 — Data reliability** | Multi-source fallback for explorer data (secondary RPC/indexer), cached registry status checks with automatic staleness flags, uptime monitoring for the tracker. | $1,400 |
| **M2 — Registry expansion** | Grow the registry from 8 to 40+ programs across Base, Ethereum, and major L2s; public submission/correction flow so programs can be added by the community; per-program disbursement-wallet directory. | $1,200 |
| **M3 — Funding alerts** | Opt-in alerts (email/RSS/webhook) when a watched funding wallet sends or receives funds or its balance moves beyond a threshold — so communities learn about disbursements as they happen. | $1,200 |
| **M4 — Public reporting** | One-click transparency reports (PDF + CSV) per program and per wallet, scheduled public report pages, and an embeddable widget other sites can use to show live funding data. | $1,200 |
| | **Total** | **$5,000** |

Success measures: registry accuracy (every status re-verified at least
monthly), number of programs and funding wallets tracked, reports generated,
and uptime of the public instance.

## Support GrantScope

GrantScope is free for everyone and has no revenue model — donations go
directly to the roadmap above (hosting, data/API credits, and development
time):

- **Giveth:** https://giveth.io/project/grantscope-grant-transparency-for-base-and-ethereum
- **Crypto (Ethereum or Base):** `0xBf61c3C004f4017772CB06Ca83Db990a8cA49186`

Every donation, however small, is public and accounted for in the project's
adoption reports.

## Contributing

Corrections to the registry are welcome — edit `data/programs.json` and
open a pull request with a source for the status change. Please include the
date you verified the status.

## License

MIT — see [LICENSE](LICENSE).
