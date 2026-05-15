# Contributing

Thank you for your interest in contributing to MarketTrust! This document covers how to set up your development environment, the conventions we follow, and the process for submitting changes.

---

## Development Setup

### Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | ≥ 20 | Use [nvm](https://github.com/nvm-sh/nvm) to manage versions |
| npm | ≥ 10 | Comes with Node.js |
| Freighter | Latest | [Install from freighter.app](https://freighter.app) |

### Getting Started

```bash
# 1. Fork and clone the repo
git clone https://github.com/your-org/MarketTrust-Frontend.git
cd MarketTrust-Frontend

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL

# 4. Start the dev server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Project Conventions

### TypeScript

- Strict mode is enabled. No `any` types without a comment explaining why.
- Prefer `interface` over `type` for object shapes.
- All props interfaces should be defined in the same file as the component.

### Component Structure

```tsx
// 1. Imports (external, then internal)
// 2. Types / interfaces
// 3. Helper functions (if small and only used here)
// 4. Component function
// 5. Export
```

### Naming

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `EscrowCard.tsx` |
| Hooks | camelCase with `use` prefix | `useTx.ts` |
| Utilities | camelCase | `formatXLM` |
| Constants | SCREAMING_SNAKE_CASE | `NETWORK_PASSPHRASE` |
| CSS variables | kebab-case | `--text-secondary` |

### Styling

- Use Tailwind utility classes directly in JSX.
- Use the `cn()` helper from `lib/utils.ts` for conditional classes.
- Design tokens (colors, spacing) are defined as CSS variables in `globals.css`. Reference them via Tailwind's `text-text-secondary`, `bg-surface`, etc.
- Do not add inline `style` props unless absolutely necessary.

### Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add escrow filtering by status
fix: correct deadline validation for same-day dates
docs: update API integration guide
refactor: extract TxStatus into standalone component
chore: bump stellar-sdk to 13.2.0
```

---

## Pull Request Process

1. **Branch** from `main` using a descriptive name: `feat/filter-by-status`, `fix/deadline-validation`
2. **Keep PRs focused** — one feature or fix per PR
3. **Update docs** if you change any public API, component interface, or environment variable
4. **Run checks** before opening a PR:
   ```bash
   npm run build   # must pass with zero errors
   npm run lint    # must pass with zero warnings
   ```
5. **Fill out the PR template** — describe what changed, why, and how to test it
6. A maintainer will review within 2–3 business days

---

## Adding a New UI Component

1. Create the file in `src/components/ui/`
2. Keep it stateless and generic — no escrow-specific logic
3. Accept a `className` prop for external style overrides
4. Use the `cn()` helper for class merging

```tsx
import { cn } from "@/lib/utils";

interface MyComponentProps {
  className?: string;
  children: React.ReactNode;
}

export function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn("base-classes", className)}>
      {children}
    </div>
  );
}
```

---

## Adding a New Escrow Action

1. Add the action type to `EscrowAction` in `src/types/escrow.ts`
2. Add the action metadata to `ACTION_META` in `EscrowActionModal.tsx`
3. Add the button to `EscrowCard.tsx` with the appropriate role guard
4. Add the API call to `src/lib/api.ts` if needed

---

## Reporting Bugs

Open a GitHub issue with:
- Steps to reproduce
- Expected vs actual behavior
- Browser and Freighter version
- Network (testnet/mainnet)

For security vulnerabilities, see [SECURITY.md](./SECURITY.md).
