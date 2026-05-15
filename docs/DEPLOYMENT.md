# Deployment

MarketTrust Frontend is a statically exportable Next.js application. It can be deployed to any static hosting provider or Node.js server.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✓ | Base URL of the MarketTrust backend API |

All `NEXT_PUBLIC_` variables are embedded at build time. You must rebuild the app if you change them.

Create a `.env.local` for local development (never commit this file):

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Vercel (Recommended)

Vercel is the zero-config deployment target for Next.js.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL
```

Or connect your GitHub repository in the Vercel dashboard and set environment variables under **Project Settings → Environment Variables**.

---

## Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

Enable standalone output in `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  output: "standalone",
};
```

Build and run:

```bash
docker build -t markettrust-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://api.yourdomain.com markettrust-frontend
```

---

## Static Export (S3, Netlify, GitHub Pages)

If you don't need server-side features, export as static HTML:

```ts
// next.config.ts
const nextConfig: NextConfig = {
  output: "export",
};
```

```bash
npm run build
# Output is in /out directory
```

Upload the `/out` directory to your static host.

> Note: Static export disables API routes and middleware. This app has none, so static export works fine.

---

## Production Checklist

- [ ] `NEXT_PUBLIC_API_URL` points to production backend
- [ ] Backend is on Stellar **Mainnet** (update `constants.ts`)
- [ ] CSP headers configured (see [SECURITY.md](./SECURITY.md))
- [ ] `npm audit` shows no high/critical vulnerabilities
- [ ] `npm run build` passes with zero errors
- [ ] Test wallet connect/disconnect on the deployed URL
- [ ] Test a full escrow creation flow on Mainnet with a small amount

---

## Switching from Testnet to Mainnet

1. Update `src/lib/constants.ts`:

```ts
export const NETWORK = "PUBLIC";
export const NETWORK_PASSPHRASE = "Public Global Stellar Network ; September 2015";
export const HORIZON_URL = "https://horizon.stellar.org";
```

2. Update the Stellar Expert explorer link in `src/components/ui/TxStatus.tsx`:

```ts
const HORIZON_TX = "https://stellar.expert/explorer/public/tx/";
```

3. Rebuild and redeploy.
