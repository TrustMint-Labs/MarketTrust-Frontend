# Security

## Threat Model

MarketTrust Frontend is a browser application that interacts with the Stellar blockchain via the Freighter wallet extension. The primary security goals are:

1. **Private keys never leave the user's device** — Freighter handles all signing
2. **The frontend cannot unilaterally move funds** — every on-chain action requires explicit user approval
3. **The backend cannot steal funds** — it only builds unsigned transactions; the user must sign
4. **No sensitive data is stored client-side** — no keys, no seeds, no session tokens

---

## Key Security Properties

### Non-Custodial Design

The frontend never has access to private keys. The signing flow is:

```
Backend builds XDR → Frontend passes to Freighter → User approves in extension → Frontend submits signed tx
```

If the backend is compromised and returns a malicious XDR, the user will see the transaction details in Freighter before signing. Users should always review what they are signing.

### No Persistent Wallet Storage

`WalletContext` stores the wallet address in React state only — it is never written to `localStorage`, `sessionStorage`, or cookies. On page refresh, the address is re-fetched from Freighter via `getAddress()` only if Freighter reports an active connection.

### Input Validation

All user inputs are validated client-side before any API call is made:

- Stellar addresses are checked for the `G` prefix and 56-character length
- Amounts are validated as positive numbers
- Deadlines must be in the future

Client-side validation is a UX convenience. The backend must independently validate all inputs and must not trust the frontend.

### XSS Considerations

- No `dangerouslySetInnerHTML` is used anywhere in the codebase
- All user-provided values are rendered as React text nodes, not raw HTML
- External links use `rel="noopener noreferrer"`

### Content Security Policy

For production deployments, add a strict CSP header in `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval'", // Next.js requires unsafe-eval in dev
              "connect-src 'self' https://horizon-testnet.stellar.org https://your-api.com",
              "img-src 'self' data:",
              "style-src 'self' 'unsafe-inline'",
            ].join("; "),
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};
```

### API Communication

- All API calls use `Content-Type: application/json`
- The API base URL is set via `NEXT_PUBLIC_API_URL` — never hardcode production URLs in source
- Errors from the API are surfaced to the user but stack traces are not exposed

### Dependency Security

Dependencies are pinned to exact minor versions in `package.json`. Run `npm audit` regularly and address high/critical vulnerabilities before deploying.

```bash
npm audit
npm audit fix
```

---

## Known Limitations

| Limitation | Impact | Mitigation |
|---|---|---|
| Client-side address validation only | Malformed addresses could reach the backend | Backend must re-validate all inputs |
| No rate limiting on the frontend | API could be spammed | Implement rate limiting on the backend |
| Freighter extension required | Users without Freighter cannot use the app | Show clear install instructions |
| Testnet only (current) | Funds have no real value | Clearly label the network in the UI |

---

## Reporting Vulnerabilities

If you discover a security vulnerability, please **do not open a public GitHub issue**. Instead, email the maintainers directly (see `CONTRIBUTING.md`). We aim to respond within 48 hours and will coordinate a responsible disclosure timeline.
