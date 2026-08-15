import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

// These fall back to the known project values only if the env vars are
// somehow missing — .env.local / GitHub Actions secrets are the source of
// truth. See .github/workflows/deploy.yml: these must be set on the BUILD
// step (where `next build` runs), not just the deploy step, since Next.js
// inlines NEXT_PUBLIC_* values into the JS bundle at build time.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'uvf97j3d';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'development';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-08-01';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // false so edits published in Studio show up immediately (no CDN edge
  // cache lag) — matches the explicit `cache: 'no-store'` already used on
  // the fetches in page.tsx.
  useCdn: false,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}
