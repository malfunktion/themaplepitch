import { getCloudflareContext } from '@opennextjs/cloudflare';

/**
 * Minimal shape of the Cloudflare Workers Rate Limiting binding (GA).
 * Defined locally instead of relying on `wrangler types` output, since
 * that command needs the Wrangler CLI, which isn't runnable from this
 * project's Termux/Android dev setup — see wrangler.toml's `ratelimits`
 * block for the actual limit/period configuration.
 */
interface RateLimitBinding {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

/**
 * Checks the shared API rate limit for a request, keyed by the caller's IP.
 * Fails OPEN on any error (missing binding, local `next dev`, etc.) so a
 * rate-limiter problem can never take the public API down — it can only
 * fail to block abuse, never fail to serve legitimate traffic.
 */
export async function checkRateLimit(request: Request): Promise<boolean> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const limiter = (env as unknown as { API_RATE_LIMITER?: RateLimitBinding }).API_RATE_LIMITER;
    if (!limiter) return true;

    const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
    const { success } = await limiter.limit({ key: ip });
    return success;
  } catch {
    return true;
  }
}

/** Standard 429 response for routes that fail the rate-limit check above. */
export function rateLimitResponse(): Response {
  return new Response(JSON.stringify({ error: 'Too many requests' }), {
    status: 429,
    headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
  });
}
