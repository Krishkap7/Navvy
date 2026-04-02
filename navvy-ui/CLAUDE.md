@AGENTS.md

# Navvy UI — Agent Guide

## Stack
- Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4
- Supabase (auth via `@supabase/ssr`)
- Google Maps JavaScript API (map, places, directions, geolocation)

## Dev
```bash
npm run dev   # http://localhost:3000
npm run build
npm run lint
```

## Env
Requires `navvy-ui/.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
BACKEND_URL=http://localhost:8000
```

## Auth Pattern
- Browser client: `lib/supabase/client.ts` — use in `"use client"` components
- Server client: `lib/supabase/server.ts` — use in Server Components and Route Handlers
- Middleware: `middleware.ts` — calls `supabase.auth.getUser()` to protect `/dashboard/*`
- Never read auth state from `document.cookie` directly

## Key Files
- `components/AuthForm.tsx` — login/signup form (calls Supabase auth)
- `components/NavBar.tsx` — reads user email from Supabase session
- `app/dashboard/profile/page.tsx` — calls `supabase.auth.signOut()`
- `middleware.ts` — route protection
- `lib/types.ts` — shared TypeScript types
- `app/api/generate-itinerary/route.ts` — proxies to backend

## Conventions
- All map logic is in `components/Map.tsx` (dynamic import, no SSR)
- Activities follow the `Activity` type in `lib/types.ts`
- Dashboard routes are always protected; landing/login/signup are public
