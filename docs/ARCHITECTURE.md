# Architecture

## Overview

MarketTrust Frontend is a **Next.js 16 App Router** application that provides a browser-based interface for the MarketTrust escrow protocol running on the Stellar blockchain. The frontend is intentionally stateless — it holds no private keys and stores no sensitive data. All business logic lives on-chain or in the backend API.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Next.js UI  │───▶│  API Client  │───▶│  Backend API │  │
│  │  (React)     │    │  (lib/api)   │    │  (REST)      │  │
│  └──────┬───────┘    └──────────────┘    └──────────────┘  │
│         │                                                   │
│  ┌──────▼───────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Wallet      │───▶│  Freighter   │    │  Stellar     │  │
│  │  Context     │    │  Extension   │    │  Horizon     │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Transaction Flow

```
User Action
    │
    ▼
Frontend calls backend API
    │  POST /escrows or POST /escrows/action
    ▼
Backend builds unsigned transaction XDR
    │  returns { txXdr: "..." }
    ▼
Frontend passes XDR to Freighter
    │  signTransaction(txXdr, { networkPassphrase })
    ▼
Freighter prompts user to sign
    │  returns { signedTxXdr }
    ▼
Frontend submits to Stellar Horizon
    │  server.submitTransaction(tx)
    ▼
Returns transaction hash → UI updates
```

This pattern means:
- The backend **never touches private keys**
- The frontend **never constructs raw transactions** (no risk of malformed XDR)
- The user **always approves** before anything is submitted on-chain

---

## Layer Breakdown

### 1. Pages (`src/app/`)

Next.js App Router pages. All pages are server components that render client component trees. No data fetching happens at the page level — pages are thin shells.

| Route | Purpose |
|---|---|
| `/` | Landing page with hero and feature overview |
| `/dashboard` | Lists all escrows for the connected wallet |
| `/escrow/new` | Create escrow form |

### 2. Components (`src/components/`)

Split into three categories:

- **`ui/`** — Primitive, reusable, stateless components (Button, Input, Badge, Card, Modal, TxStatus). No business logic.
- **`layout/`** — Structural components (Navbar, AppShell). Consume `WalletContext`.
- **`escrow/`** — Feature components tied to escrow domain logic (CreateEscrowForm, EscrowDashboard, EscrowCard, EscrowActionModal).

### 3. Context (`src/context/`)

`WalletContext` is the single source of truth for wallet state. It wraps the entire app and exposes `address`, `connecting`, `connect()`, and `disconnect()`. On mount it silently restores an existing Freighter session.

### 4. Hooks (`src/hooks/`)

| Hook | Responsibility |
|---|---|
| `useTx` | Manages the full transaction lifecycle: pending → sign → submit → success/error. Fires toast notifications at each stage. |
| `useEscrows` | Fetches and caches the escrow list for the connected wallet. Exposes `refetch()` for manual refresh. |

### 5. Library (`src/lib/`)

| File | Responsibility |
|---|---|
| `api.ts` | Typed REST client. All backend calls go through here. |
| `stellar.ts` | `signAndSubmit()` — the only place Freighter and Horizon are called together. |
| `constants.ts` | Network config, status label/color maps. |
| `utils.ts` | Pure helper functions (formatting, address truncation). |

### 6. Types (`src/types/`)

Shared TypeScript interfaces. `Escrow`, `EscrowStatus`, `TxState`, `CreateEscrowParams`, `EscrowAction`. These are the contract between the frontend and backend.

---

## State Management

No external state library is used. State is managed at three levels:

| Level | Mechanism | What lives here |
|---|---|---|
| Global | React Context (`WalletContext`) | Wallet address, connection state |
| Feature | Custom hooks (`useEscrows`) | Escrow list, loading/error state |
| Local | `useState` in components | Form values, modal open state, selected action |

This is intentionally minimal. The app has no complex shared state that would justify Redux or Zustand.

---

## Rendering Strategy

All pages are statically pre-rendered at build time (no `getServerSideProps`, no dynamic segments). Wallet-dependent data is fetched client-side after hydration. This means:

- Zero server infrastructure required — the app can be deployed to any static host (Vercel, Netlify, S3+CloudFront)
- No wallet address is ever sent to a server during SSR
- First paint is fast; data loads progressively

---

## Backend Contract

The frontend expects a REST API at `NEXT_PUBLIC_API_URL` with the following endpoints:

```
GET  /escrows?wallet=G...          → Escrow[]
GET  /escrows/:id                  → Escrow
POST /escrows                      → { txXdr: string }
POST /escrows/action               → { txXdr: string }
```

All `POST` endpoints return an **unsigned transaction XDR** that the frontend signs and submits. See [API Integration](./API_INTEGRATION.md) for full request/response shapes.
