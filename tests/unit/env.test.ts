import { afterEach, describe, expect, it, vi } from 'vitest';
import { __testing, bookingUrl, dashboardUrl, deliveryMode, siteUrl } from '@/lib/env';

const ORIGINAL = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL };
  vi.unstubAllEnvs();
});

describe('clean', () => {
  it('drops empty and whitespace-only values', () => {
    expect(__testing.clean(undefined)).toBeUndefined();
    expect(__testing.clean('')).toBeUndefined();
    expect(__testing.clean('   ')).toBeUndefined();
    expect(__testing.clean('  value  ')).toBe('value');
  });
});

describe('asUrl', () => {
  it('accepts http and https and strips a trailing slash', () => {
    expect(__testing.asUrl('https://example.com/')).toBe('https://example.com');
    expect(__testing.asUrl('http://localhost:3000')).toBe('http://localhost:3000');
  });

  it('rejects malformed and non-http protocols', () => {
    expect(__testing.asUrl('not a url')).toBeUndefined();
    expect(__testing.asUrl('javascript:alert(1)')).toBeUndefined();
    expect(__testing.asUrl('ftp://example.com')).toBeUndefined();
    expect(__testing.asUrl('')).toBeUndefined();
  });
});

describe('siteUrl', () => {
  it('prefers the explicit site URL', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://growlabel.example/');
    expect(siteUrl()).toBe('https://growlabel.example');
  });

  it('falls back to the Vercel URL, then to localhost', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_VERCEL_URL', 'preview.vercel.app');
    expect(siteUrl()).toBe('https://preview.vercel.app');

    vi.stubEnv('NEXT_PUBLIC_VERCEL_URL', '');
    vi.stubEnv('VERCEL_URL', '');
    expect(siteUrl()).toBe('http://localhost:3000');
  });
});

describe('optional links', () => {
  it('returns undefined when unset so the action can be hidden', () => {
    vi.stubEnv('NEXT_PUBLIC_DASHBOARD_URL', '');
    vi.stubEnv('NEXT_PUBLIC_BOOKING_URL', '');
    expect(dashboardUrl()).toBeUndefined();
    expect(bookingUrl()).toBeUndefined();
  });

  it('returns a normalised URL when set', () => {
    vi.stubEnv('NEXT_PUBLIC_DASHBOARD_URL', 'https://app.example.com/');
    expect(dashboardUrl()).toBe('https://app.example.com');
  });

  it('ignores a malformed value rather than rendering a broken link', () => {
    vi.stubEnv('NEXT_PUBLIC_BOOKING_URL', 'definitely-not-a-url');
    expect(bookingUrl()).toBeUndefined();
  });
});

describe('deliveryMode', () => {
  it('is unconfigured with no provider set', () => {
    vi.stubEnv('CONTACT_WEBHOOK_URL', '');
    vi.stubEnv('RESEND_API_KEY', '');
    vi.stubEnv('CONTACT_TO_EMAIL', '');
    expect(deliveryMode()).toBe('unconfigured');
  });

  it('prefers a webhook when both are configured', () => {
    vi.stubEnv('CONTACT_WEBHOOK_URL', 'https://hooks.example/abc');
    vi.stubEnv('RESEND_API_KEY', 're_123');
    vi.stubEnv('CONTACT_TO_EMAIL', 'sales@example.com');
    expect(deliveryMode()).toBe('webhook');
  });

  it('requires both halves of the email configuration', () => {
    vi.stubEnv('CONTACT_WEBHOOK_URL', '');
    vi.stubEnv('RESEND_API_KEY', 're_123');
    vi.stubEnv('CONTACT_TO_EMAIL', '');
    expect(deliveryMode()).toBe('unconfigured');

    vi.stubEnv('CONTACT_TO_EMAIL', 'sales@example.com');
    expect(deliveryMode()).toBe('email');
  });
});
