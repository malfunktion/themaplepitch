# Wire Ingest Worker — one-time setup

This Worker is separate from the main site's deploy — pushing this folder
to `dev` deploys *only* this Worker (see
`.github/workflows/deploy-wire-ingest.yml`). Before the first deploy will
actually work, do these three things once:

## 1. Create a Sanity write token
Go to **manage.sanity.io** → your project → **API** → **Tokens** →
**Add API token**. Name it something like `wire-ingest`, set permission to
**Editor** (needs write access — the default **Viewer** token won't work),
and copy the token immediately — Sanity only shows it once.

## 2. Set two Worker secrets (Cloudflare dashboard, not Termux)
After the first deploy has run once (so the Worker `maplepitch-wire-ingest`
exists to attach secrets to): Cloudflare dashboard → **Workers & Pages** →
`maplepitch-wire-ingest` → **Settings** → **Variables and Secrets** →
**Add**, twice:

- `SANITY_WRITE_TOKEN` — the token from step 1.
- `MANUAL_TRIGGER_KEY` — any random string you make up (e.g. a long
  password). Lets you trigger a run on demand for testing — see below —
  without waiting for the cron.

Secrets set this way persist across future deploys on their own; you don't
need to re-set them each time this folder gets pushed.

## 3. Confirm the cron trigger is on
Cloudflare dashboard → the Worker → **Triggers** tab → confirm the cron
schedule shows as active. It's declared in `wrangler.toml` and should
enable automatically on deploy, but worth a glance the first time.

## Testing without waiting for the cron
Once secrets are set, find the Worker's `*.workers.dev` URL on its
Cloudflare dashboard overview page, then visit:

```
https://maplepitch-wire-ingest.<your-subdomain>.workers.dev/?key=<MANUAL_TRIGGER_KEY>
```

Returns a JSON summary (`checked`, `withinLookback`, `alreadyIngested`,
`created`, `errors`) instead of running silently, so you can see it
actually did something before checking Studio.

## What it does *not* do
It never sets `isApproved: true`. Every item it creates still needs to be
opened and approved by hand in Studio — this only saves the typing on
entry, not the review step.
