# NFT Gift Market

A Telegram Mini App marketplace for buying and selling Telegram NFT gifts using TON (The Open Network) cryptocurrency.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/gift-market run dev` — run the Mini App frontend (port 23287)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required secrets: `BOT_TOKEN`, `ADMIN_TELEGRAM_ID`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Frontend: React + Vite + Tailwind CSS + shadcn/ui + framer-motion
- Bot: Telegraf (Telegram Bot API)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all contracts)
- `lib/db/src/schema/` — Drizzle ORM table definitions (users.ts, gifts.ts)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/api-server/src/lib/bot.ts` — Telegram bot setup (Telegraf)
- `artifacts/gift-market/src/` — React Mini App frontend
- `artifacts/gift-market/src/pages/` — store, my-gifts, season, profile, admin, onboarding

## Architecture decisions

- Admin check uses both env-var `ADMIN_TELEGRAM_ID` and DB `isAdmin` flag — whichever is true grants access
- Dates from Drizzle (Date objects) are serialized to ISO strings via `serializeDates()` before Zod parsing
- Dev mode mock: when Telegram WebApp is not available, uses `telegramId: "dev_user_1"` for local dev
- Bot auto-starts when `BOT_TOKEN` and `REPLIT_DOMAINS` are both set at server startup
- Admin sends `x-telegram-id` header with every API request to identify themselves

## Product

- **Store** — 2-column grid of listed NFT gifts with prices in TON. Search and filter support.
- **My Gifts** — User's gift inventory (Unlisted/Listed tabs). Add/Withdraw/Send/Sell actions.
- **Season** — Season leaderboard, tasks, and points tracking.
- **Profile** — User stats, cashback level, invite friends.
- **Onboarding** — 5-slide animated intro shown once to new users.
- **Admin Panel** — Paste a Telegram gift link, preview it, set a price, publish/unpublish/delete.

## User preferences

- Always dark mode (no light mode toggle)
- Main currency: TON (◈)
- Admin menu only visible to the configured admin Telegram ID
- All UI text in English

## Gotchas

- Always run `pnpm run typecheck:libs` after changing `lib/db/src/schema/` before typechecking api-server
- After OpenAPI spec changes, run codegen before using updated types in frontend or backend
- Telegram Mini App must be served over HTTPS for `window.Telegram.WebApp` to work (Replit handles this)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
