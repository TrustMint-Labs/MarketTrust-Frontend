# API Integration

The frontend communicates with a backend REST API to build Stellar transactions. The backend constructs unsigned transaction XDR; the frontend signs and submits it via Freighter.

## Configuration

Set the backend URL in your environment:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

For production, set this in your deployment environment (Vercel environment variables, etc.).

---

## Endpoints

### `GET /escrows?wallet=<address>`

Returns all escrows where the wallet is buyer, seller, or arbiter.

**Response**
```json
[
  {
    "id": "abc123",
    "buyer": "GABC...XYZ",
    "seller": "GDEF...UVW",
    "arbiter": "GHIJ...RST",
    "amount": "1000000000",
    "deadline": 1780000000,
    "status": "active",
    "createdAt": 1715000000,
    "disputeReason": null
  }
]
```

---

### `GET /escrows/:id`

Returns a single escrow by ID.

**Response** — same shape as a single item from the list above.

---

### `POST /escrows`

Builds an unsigned transaction to create a new escrow.

**Request body**
```json
{
  "seller": "GDEF...UVW",
  "arbiter": "GHIJ...RST",
  "amount": "100",
  "deadline": 1780000000
}
```

| Field | Type | Description |
|---|---|---|
| `seller` | `string` | Stellar address of the seller |
| `arbiter` | `string` | Stellar address of the trusted arbiter |
| `amount` | `string` | Amount in XLM (e.g. `"100"`) |
| `deadline` | `number` | Unix timestamp (seconds) |

**Response**
```json
{
  "txXdr": "AAAAAgAAAAA..."
}
```

The frontend signs this XDR with Freighter and submits it to Horizon.

---

### `POST /escrows/action`

Builds an unsigned transaction for a buyer/arbiter action on an existing escrow.

**Request body**
```json
{
  "escrowId": "abc123",
  "action": "release",
  "winner": "seller",
  "reason": "Item not delivered"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `escrowId` | `string` | ✓ | ID of the escrow |
| `action` | `"release" \| "refund" \| "dispute" \| "resolve"` | ✓ | Action to perform |
| `winner` | `"buyer" \| "seller"` | Only for `resolve` | Who receives the funds |
| `reason` | `string` | Optional for `dispute` | Human-readable dispute reason |

**Response**
```json
{
  "txXdr": "AAAAAgAAAAA..."
}
```

---

## Error Responses

All error responses follow this shape:

```json
{
  "message": "Human-readable error description"
}
```

The frontend surfaces `message` directly in the UI toast and `TxStatus` component. Keep messages user-friendly.

---

## Escrow Status Lifecycle

```
pending ──▶ active ──▶ released
                  └──▶ refunded   (after deadline)
                  └──▶ disputed ──▶ resolved
```

| Status | Who can act | Available actions |
|---|---|---|
| `pending` | — | Waiting for on-chain confirmation |
| `active` | Buyer | Release, Refund (after deadline), Dispute |
| `released` | — | Terminal state |
| `refunded` | — | Terminal state |
| `disputed` | Arbiter | Resolve (pick winner) |
| `resolved` | — | Terminal state |

---

## Mocking the API for Development

If you don't have a backend running, you can use `msw` (Mock Service Worker) or a simple Express mock:

```ts
// mock-server.ts (run with ts-node)
import express from "express";
const app = express();
app.use(express.json());

app.get("/escrows", (req, res) => {
  res.json([]); // return empty list
});

app.post("/escrows", (req, res) => {
  res.json({ txXdr: "AAAA..." }); // return a dummy XDR
});

app.listen(3001, () => console.log("Mock API running on :3001"));
```
