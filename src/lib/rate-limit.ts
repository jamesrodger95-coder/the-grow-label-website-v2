/**
 * In-memory fixed-window rate limiter.
 *
 * This is a per-instance boundary, not a distributed guarantee: on a serverless
 * platform each instance keeps its own counters. It is deliberately simple and
 * has no external dependency. Swap the store for a shared one (Redis, Vercel KV)
 * if the deployment ever needs a hard global limit.
 */

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

/** Cap the map so a flood of unique keys cannot grow memory without bound. */
const MAX_KEYS = 5000;

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 10 * 60 * 1000,
  now = Date.now()
): RateLimitResult {
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    if (store.size >= MAX_KEYS) evictExpired(now);
    const bucket: Bucket = { count: 1, resetAt: now + windowMs };
    store.set(key, bucket);
    return { ok: true, remaining: limit - 1, resetAt: bucket.resetAt, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  const ok = existing.count <= limit;
  return {
    ok,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
    retryAfterSeconds: ok ? 0 : Math.ceil((existing.resetAt - now) / 1000),
  };
}

function evictExpired(now: number): void {
  for (const [k, v] of store) {
    if (v.resetAt <= now) store.delete(k);
  }
  // If everything is still live, drop the oldest entry so the map stays bounded.
  if (store.size >= MAX_KEYS) {
    const first = store.keys().next();
    if (!first.done) store.delete(first.value);
  }
}

/**
 * Best-effort client identity from proxy headers. Only used for rate limiting,
 * never stored and never sent anywhere.
 */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return headers.get('x-real-ip') ?? headers.get('cf-connecting-ip') ?? 'unknown';
}

export const __testing = {
  reset(): void {
    store.clear();
  },
  size(): number {
    return store.size;
  },
};
