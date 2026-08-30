import { beforeEach, describe, expect, it } from 'vitest';
import { __testing, clientKey, rateLimit } from '@/lib/rate-limit';

beforeEach(() => {
  __testing.reset();
});

describe('rateLimit', () => {
  it('allows requests up to the limit and blocks the next one', () => {
    const now = 1_000_000;
    for (let i = 1; i <= 5; i++) {
      const result = rateLimit('ip', 5, 60_000, now);
      expect(result.ok).toBe(true);
      expect(result.remaining).toBe(5 - i);
    }
    const blocked = rateLimit('ip', 5, 60_000, now);
    expect(blocked.ok).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('starts a fresh window once the old one expires', () => {
    const now = 1_000_000;
    for (let i = 0; i < 5; i++) rateLimit('ip', 5, 60_000, now);
    expect(rateLimit('ip', 5, 60_000, now).ok).toBe(false);
    expect(rateLimit('ip', 5, 60_000, now + 60_001).ok).toBe(true);
  });

  it('tracks each key independently', () => {
    const now = 1_000_000;
    for (let i = 0; i < 5; i++) rateLimit('a', 5, 60_000, now);
    expect(rateLimit('a', 5, 60_000, now).ok).toBe(false);
    expect(rateLimit('b', 5, 60_000, now).ok).toBe(true);
  });
});

describe('clientKey', () => {
  it('reads the first address from x-forwarded-for', () => {
    const headers = new Headers({ 'x-forwarded-for': '203.0.113.5, 70.41.3.18' });
    expect(clientKey(headers)).toBe('203.0.113.5');
  });

  it('falls back through the other proxy headers', () => {
    expect(clientKey(new Headers({ 'x-real-ip': '198.51.100.7' }))).toBe('198.51.100.7');
    expect(clientKey(new Headers({ 'cf-connecting-ip': '198.51.100.9' }))).toBe('198.51.100.9');
    expect(clientKey(new Headers())).toBe('unknown');
  });
});
