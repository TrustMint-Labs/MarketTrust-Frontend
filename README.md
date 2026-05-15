# MarketTrust — Stellar Escrow Protocol

> A trustless, non-custodial escrow protocol on the Stellar blockchain. Secure buyer–seller transactions with on-chain dispute resolution.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Stellar](https://img.shields.io/badge/Stellar-Testnet-7c3aed?logo=stellar)](https://stellar.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

---

## What is MarketTrust?

MarketTrust is an open-source escrow protocol built on Stellar. It allows two parties (buyer and seller) to transact without trusting each other — funds are locked on-chain and only released when both parties are satisfied, or resolved by a neutral arbiter in the event of a dispute.

**This repository is the frontend.** It is a React/Next.js web application that connects to a Stellar wallet (Freighter) and communicates with the [MarketTrust Backend API](#backend) to build, sign, and submit escrow transactions.

---

## Features

- **Wallet connection** via Freighter — connect, disconnect, copy address, session restore
- **Create escrow** — specify seller, arbiter, amount (XLM), and deadline
- **Escrow dashboard** — view all escrows where you are buyer, seller, or arbiter
- **Buyer actions** — release funds, claim refund after deadline, raise dispute
- **Arbiter resolution** — pick winner (buyer or seller) to resolve a disputed escrow
- **Real-time transaction feedback** — pending → signing → submitted → confirmed/failed
- **Clean, dark UI** — Linear/Vercel-inspired design, fully responsive

---

## Screenshots

> _Add screenshots here once deployed._

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 20
- [Freighter wallet extension](https://freighter.app) installed in your browser
- A running instance of the [MarketTrust Backend](#backend)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/MarketTrust-Frontend.git
cd MarketTrust-Frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL to your backend URL

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
MarketTrust-Frontend/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── layout.tsx              # Root layout (providers, toast)
│   │   ├── page.tsx                # Landing page
│   │   ├── dashboard/page.tsx      # Escrow dashboard
│   │   └── escrow/new/page.tsx     # Create escrow
│   │
│   ├── components/
│   │   ├── ui/                     # Primitive UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── TxStatus.tsx
│   │   ├── layout/                 # Structural components
│   │   │   ├── Navbar.tsx
│   │   │   └── AppShell.tsx
│   │   └── escrow/                 # Feature components
│   │       ├── CreateEscrowForm.tsx
│   │       ├── EscrowDashboard.tsx
│   │       ├── EscrowCard.tsx
│   │       └── EscrowActionModal.tsx
│   │
│   ├── context/
│   │   └── WalletContext.tsx       # Freighter wallet state
│   │
│   ├── hooks/
│   │   ├── useTx.ts                # Transaction lifecycle hook
│   │   └── useEscrows.ts           # Escrow list fetching hook
│   │
│   ├── lib/
│   │   ├── api.ts                  # Backend REST client
│   │   ├── stellar.ts              # Sign & submit via Freighter + Horizon
│   │   ├── constants.ts            # Network config, status maps
│   │   └── utils.ts                # Formatting helpers
│   │
│   └── types/
│       └── escrow.ts               # Shared TypeScript interfaces
│
├── docs/                           # Extended documentation
├── public/                         # Static assets
├── .env.example                    # Environment variable template
└── package.json
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | [TypeScript 5](https://typescriptlang.org) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Wallet | [Freighter](https://freighter.app) via `@stellar/freighter-api` |
| Blockchain | [Stellar](https://stellar.org) via `@stellar/stellar-sdk` |
| Notifications | [react-hot-toast](https://react-hot-toast.com) |
| Icons | [Lucide React](https://lucide.dev) |

---

## How It Works

### Transaction Flow

Every on-chain action follows the same pattern:

```
1. User fills form / clicks action button
2. Frontend calls backend API → receives unsigned transaction XDR
3. Frontend passes XDR to Freighter → user approves in extension
4. Frontend submits signed transaction to Stellar Horizon
5. UI updates with transaction hash and new escrow status
```

The backend **never holds private keys**. The frontend **never constructs raw transactions**. The user **always approves** before anything is submitted on-chain.

### Escrow Lifecycle

```
pending ──▶ active ──▶ released
                  └──▶ refunded   (buyer, after deadline)
                  └──▶ disputed ──▶ resolved  (arbiter picks winner)
```

### Role-Based Actions

| Role | Available Actions |
|---|---|
| Buyer | Release funds, Refund (after deadline), Raise dispute |
| Seller | View only |
| Arbiter | Resolve dispute (pick buyer or seller as winner) |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✓ | Base URL of the MarketTrust backend API |

See `.env.example` for a template.

---

## Documentation

| Document | Description |
|---|---|
| [Architecture](./docs/ARCHITECTURE.md) | System design, layer breakdown, rendering strategy, backend contract |
| [API Integration](./docs/API_INTEGRATION.md) | All API endpoints, request/response shapes, escrow lifecycle |
| [Wallet Integration](./docs/WALLET_INTEGRATION.md) | Freighter setup, signing flow, network config, extending to other wallets |
| [Security](./docs/SECURITY.md) | Threat model, key security properties, CSP, known limitations |
| [Deployment](./docs/DEPLOYMENT.md) | Vercel, Docker, static export, Mainnet migration checklist |
| [Contributing](./docs/CONTRIBUTING.md) | Dev setup, conventions, PR process, adding components/actions |

---

## Backend

This frontend requires a compatible backend API. The backend is responsible for:

- Storing escrow state
- Building unsigned Stellar transaction XDR
- Validating all inputs server-side

The expected API contract is documented in [API Integration](./docs/API_INTEGRATION.md).

> The backend repository link will be added here once published.

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./docs/CONTRIBUTING.md) before opening a pull request.

For bug reports, open a [GitHub issue](https://github.com/your-org/MarketTrust-Frontend/issues).  
For security vulnerabilities, see [SECURITY.md](./docs/SECURITY.md) — **do not open a public issue**.

---

## License

[MIT](./LICENSE) — free to use, modify, and distribute.

---

## Acknowledgements

- [Stellar Development Foundation](https://stellar.org) for the Stellar network and Freighter wallet
- [Vercel](https://vercel.com) for Next.js
