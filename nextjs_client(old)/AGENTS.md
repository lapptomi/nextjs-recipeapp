# AGENTS.md (client)

This file applies to `client/` and complements the root `AGENTS.md`.

## Scope

- Follow all shared rules from `/AGENTS.md`.
- This file only adds frontend-local guidance.

## Stack

- Next.js 16 + React 19 (TypeScript)
- Material-UI v7 + Tailwind CSS
- NextAuth for authentication

## Local Commands

```bash
npm run dev
npm run build
npm run lint
npm run fmt
npm run fmtCheck
npm run cypress:open
npm run cypress:run
```

## Frontend Conventions

- Use TypeScript and keep types strict.
- Prefer function declarations for React components.
- Keep import order: `react` -> external -> internal.
- Use `undefined` instead of `null`.
- Keep formatting/lint clean with ESLint + Prettier.

## Key Paths

- `src/app/` - App Router pages
- `src/components/` - Reusable UI components
- `src/lib/` - API client and server actions
- `src/types/index.ts` - Zod schemas and shared types

## Auth/API Notes

- Backend API base URL comes from `NEXT_APP_API_URL`.
- JWT from NextAuth session is sent via Axios interceptor in `src/lib/apiClient.ts`.
- For local dev, set `SKIP_COUNTRY_CHECK=true` in `client/.env.local` to bypass geo-blocking.
