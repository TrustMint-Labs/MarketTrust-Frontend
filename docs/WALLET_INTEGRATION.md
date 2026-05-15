# Wallet Integration

MarketTrust uses [Freighter](https://freighter.app) — the official Stellar browser extension wallet — for all signing operations. This document explains how the integration works and how to extend it.

---

## Why Freighter

- Official Stellar Foundation-backed wallet
- Non-custodial: private keys never leave the extension
- Supports both Testnet and Mainnet
- Clean JavaScript API (`@stellar/freighter-api`)

---

## How It Works

### Session Lifecycle

```
App mounts
    │
    ▼
isConnected() ──▶ false ──▶ Show "Connect Wallet" button
    │
    ▼ true
getAddress() ──▶ Restore address in WalletContext
```

When the user clicks "Connect Wallet":

```
connect() called
    │
    ▼
requestAccess() ──▶ Freighter popup opens
    │
    ▼ User approves
address stored in WalletContext (React state only)
```

### Signing a Transaction

All transaction signing goes through `src/lib/stellar.ts`:

```ts
export async function signAndSubmit(txXdr: string): Promise<string> {
  // 1. Ask Freighter to sign
  const { signedTxXdr, error } = await signTransaction(txXdr, {
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  if (error) throw new Error(error.message);

  // 2. Parse and submit to Horizon
  const tx = new Transaction(signedTxXdr, NETWORK_PASSPHRASE);
  const result = await server.submitTransaction(tx);
  return result.hash;
}
```

The `useTx` hook wraps this with loading state and toast notifications.

---

## Freighter API Reference

The integration uses these methods from `@stellar/freighter-api`:

| Method | When used | Returns |
|---|---|---|
| `isConnected()` | On app mount | `{ isConnected: boolean }` |
| `getAddress()` | On mount (if connected) | `{ address: string }` |
| `requestAccess()` | On "Connect Wallet" click | `{ address: string }` |
| `signTransaction(xdr, opts)` | Before every on-chain action | `{ signedTxXdr: string }` |

---

## Network Configuration

The network is configured in `src/lib/constants.ts`:

```ts
export const NETWORK = "TESTNET";
export const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
export const HORIZON_URL = "https://horizon-testnet.stellar.org";
```

To switch to Mainnet, update all three values:

```ts
export const NETWORK = "PUBLIC";
export const NETWORK_PASSPHRASE = "Public Global Stellar Network ; September 2015";
export const HORIZON_URL = "https://horizon.stellar.org";
```

> ⚠️ Freighter will reject a transaction if the `networkPassphrase` in the signing request does not match the network the user has selected in the extension. Always keep these in sync.

---

## Handling Freighter Not Installed

If the user does not have Freighter installed, `requestAccess()` will throw or return an error. The `connect()` function in `WalletContext` propagates this error, which surfaces as a toast notification.

To improve UX, you can detect Freighter's absence and show an install prompt:

```ts
import { isConnected } from "@stellar/freighter-api";

const { isConnected: hasFreighter } = await isConnected();
if (!hasFreighter) {
  // Show install prompt linking to https://freighter.app
}
```

---

## Disconnecting

"Disconnect" in the current implementation clears the address from React state only. It does not revoke Freighter's permission for the site. This is standard behavior — the user can revoke site access from within the Freighter extension settings.

---

## Extending to Other Wallets

The wallet integration is isolated to two files:

- `src/context/WalletContext.tsx` — connection state
- `src/lib/stellar.ts` — signing and submission

To add support for another wallet (e.g., Albedo, xBull), create an adapter that implements the same interface:

```ts
interface WalletAdapter {
  getAddress(): Promise<string>;
  signTransaction(xdr: string, networkPassphrase: string): Promise<string>;
}
```

Then swap the adapter in `WalletContext` and `stellar.ts` without touching any other component.
