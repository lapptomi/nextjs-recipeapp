# Client — Next.js Frontend

## Stack
- Next.js 16 + React 19 (TypeScript)
- Material-UI v7 + Tailwind CSS
- NextAuth v4 (credentials, GitHub, Google OAuth)
- Axios, React Hook Form, Zod, React Icons

## Dev Commands
```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run lint         # ESLint
npm run fmt          # Prettier + lint fix
npm run fmtCheck     # Check formatting (runs in pre-commit)
npm run cypress:open # Cypress interactive
npm run cypress:run  # Cypress headless
```

## Folder Structure
```
src/
├── app/
│   ├── (main)/              # Route group with Footer layout
│   │   ├── page.tsx         # Landing page
│   │   ├── auth/            # Login + register pages
│   │   ├── recipes/         # Browse, detail, create pages
│   │   ├── profiles/[id]/   # User profile + settings
│   │   └── privacy/
│   ├── recipes/generate/    # AI recipe generation (outside main group)
│   └── api/auth/[...nextauth]/  # NextAuth route handler
├── components/              # 18 reusable components
├── lib/
│   ├── actions/             # Server actions: auth.ts, recipe.ts, user.ts
│   ├── apiClient.ts         # Axios instance with JWT Bearer interceptor
│   ├── constants.ts         # App-wide constants and ROUTES enum
│   └── theme.ts             # MUI theme (orange primary #ed6c02)
├── types/
│   ├── index.ts             # Zod schemas + TypeScript interfaces (centralized)
│   └── next-auth.d.ts       # NextAuth session type augmentation
└── middleware.ts            # Geo-blocking (Finland-only in prod)
```

## Key Patterns

### Server vs Client Components
- Pages are server components by default — use `getSession()` and server actions directly
- Mark interactive/form components with `"use client"`
- Data fetching lives in `src/lib/actions/`, not inline in pages

### Authentication
- NextAuth stores JWT from backend in session
- `apiClient.ts` interceptor automatically attaches `Authorization: Bearer {token}`
- Protected pages check session and redirect to `/auth/login` if unauthenticated

### Forms
- React Hook Form + Zod (`zodResolver`) for all forms
- Dynamic field arrays for ingredients/instructions
- `FormData` for recipe image uploads (multipart)

### Loading States
- Suspense boundaries with skeleton fallbacks (`RecipeGridSkeleton`, `RecipeListSkeleton`)

### Styling
- MUI components for structure, Tailwind utilities for spacing/layout
- Tailwind configured with `important: '#root'` for specificity over MUI
- No inline styles — use MUI `sx` prop or Tailwind classes

## Code Conventions
- ESLint + Prettier, 2-space indentation, semicolons required
- Function declarations preferred over arrow functions for components
- Import order: react → external → internal
- No `null` — use `undefined`
- Path alias `@/` maps to `src/`
- All types/schemas in `src/types/index.ts`

## Environment Variables (`client/.env.local`)
```
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
NEXT_APP_API_URL=http://localhost:8080
GITHUB_ID=...
GITHUB_SECRET=...
GOOGLE_ID=...
GOOGLE_SECRET=...
SKIP_COUNTRY_CHECK=true
```
