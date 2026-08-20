import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

initOpenNextCloudflareForDev();

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  { key: 'Content-Security-Policy', value: "default-src 'self'; img-src 'self' data: https://images.unsplash.com; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https://*.supabase.co; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self';" },
];

const nextConfig: NextConfig = {
  // REQUIRED by @opennextjs/cloudflare — the adapter packages a Next.js app
  // built in standalone mode into .open-next/worker.js, which is what
  // wrangler.toml's `main` field deploys. Without this, `next build`
  // produces a different output shape and the Cloudflare Worker either
  // fails to build or has nothing valid to deploy. Do not remove this.
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Team crests, press-kit photography, and player headshots will come
    // from external sources (leagues, official press kits) rather than
    // being stored in this repo. Add each source's hostname here as we
    // wire up real data — e.g. canpl.ca, thenorthernsuperleague.ca, etc.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      // Supabase Storage: team crests and player headshots synced by
      // scripts/sync-all-media-forced.mjs into the `media` bucket.
      { protocol: 'https', hostname: 'wsbyyvtcvyhidvijvwuo.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
