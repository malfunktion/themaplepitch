# The Maple Pitch — Foundation Scaffold

This is the structural skeleton: the design system, the 3-column
"Command Center" home page layout, and routed-but-empty stub pages
for the main sections. It runs and renders right now on mock data.
It is **not** yet wired to Supabase, auth, or payments — that's the
next phase, once the Supabase tables actually exist.

## What's here

- **Next.js (App Router, TypeScript)** — `src/app/`
- **Tailwind v4** — design tokens live in `src/app/globals.css` under
  `@theme`. Colors: `bg`/`surface` (Scandinavian-minimalist base),
  `charcoal` (text), `crimson` (reserved *only* for live states and
  conversion CTAs — the "Rule of Crimson"). The crimson hex is an
  approximation from the logo artwork; nudge it in `globals.css` if
  it's slightly off from the real brand file.
- **Mock data layer** — `src/lib/data/*.ts`. Every function is
  already `async`, returning the same shape Supabase will eventually
  return, so swapping the body for a real `.select()` call later
  won't require touching any component.
- **Supabase client** — `src/lib/supabase/client.ts`, connection-ready
  but not yet used by any page. Copy `.env.example` to `.env.local`
  and fill in your project URL/anon key when you're ready to start
  wiring real data in.
- **Cloudflare deploy config** — `open-next.config.ts` and
  `wrangler.jsonc`, set up per our Cloudflare Workers + OpenNext
  conversation.

## Running it locally

```
npm install
npm run dev
```

Then open http://localhost:3000. You should see the home page with
the mock news stories, standings, and live ticker.

If any package version in `package.json` fails to resolve (this
ecosystem moves fast), run `npm install <package>@latest` for that
one package — the rest won't be affected.

## Deploying to Cloudflare

```
npm run cf:build      # builds via the OpenNext adapter
npm run cf:deploy      # deploys via wrangler
```

You'll need a Cloudflare account connected via `wrangler login` first
time through.

## Suggested next steps, in order

1. **Supabase schema** — create the real tables (`news_wire`,
   `standings`, teams/players) matching the shapes in
   `src/lib/types.ts`, then swap the mock functions in
   `src/lib/data/` for real Supabase queries.
2. **RSS ingestion pipeline** — the automated piece that populates
   `news_wire` and feeds your approval queue.
3. **Auth** — Supabase passwordless (magic link + OAuth), plus the
   `is_paid_supporter` flag, once you're ready to build the approval
   queue and the Supporter Tier for real.
4. **Provincial leagues, national teams, stats pages** — currently
   stub pages that route correctly; build these out once their data
   sources are ready.

## A note on the placeholder data

Everything you see on first run — headlines, standings, scores — is
fake. It's there so the layout and design system are checkable
visually before any real data source is connected, not because
these are real results.
