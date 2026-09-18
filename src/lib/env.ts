/**
 * Optional environment variables.
 *
 * Every one of these is optional by design. When a variable is missing the
 * affected action is hidden or adapted rather than rendered in a broken state,
 * so the site is always deployable with no configuration at all.
 */

function clean(value: string | undefined): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function asUrl(value: string | undefined): string | undefined {
  const v = clean(value);
  if (!v) return undefined;
  try {
    const u = new URL(v);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return undefined;
    return u.toString().replace(/\/$/, '');
  } catch {
    return undefined;
  }
}

/**
 * Public site origin, used for canonical URLs, the sitemap and Open Graph.
 * Falls back to the Vercel-provided URL, then to localhost.
 */
export function siteUrl(): string {
  const explicit = asUrl(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return explicit;
  const vercel = clean(process.env.NEXT_PUBLIC_VERCEL_URL) ?? clean(process.env.VERCEL_URL);
  if (vercel) return `https://${vercel.replace(/\/$/, '')}`;
  return 'http://localhost:3000';
}

/** Link to the client dashboard. Hidden entirely when not configured. */
export function dashboardUrl(): string | undefined {
  return asUrl(process.env.NEXT_PUBLIC_DASHBOARD_URL);
}

/** External booking/scheduling link. Hidden entirely when not configured. */
export function bookingUrl(): string | undefined {
  return asUrl(process.env.NEXT_PUBLIC_BOOKING_URL);
}

/**
 * Whether the calculator has anywhere to send a lead. A deployment that can
 * already receive an assessment request can receive one without further
 * configuration, so the contact webhook counts.
 */
export function leadDeliveryConfigured(): boolean {
  return Boolean(clean(process.env.CALCULATOR_CRM_URL) ?? clean(process.env.CONTACT_WEBHOOK_URL));
}

export type DeliveryMode = 'webhook' | 'email' | 'unconfigured';

/**
 * Which delivery provider the contact form should use. Resolved on the server
 * only — the values themselves are never sent to the client.
 */
export function deliveryMode(): DeliveryMode {
  if (clean(process.env.CONTACT_WEBHOOK_URL)) return 'webhook';
  if (clean(process.env.RESEND_API_KEY) && clean(process.env.CONTACT_TO_EMAIL)) return 'email';
  return 'unconfigured';
}

export const serverEnv = {
  contactWebhookUrl: () => clean(process.env.CONTACT_WEBHOOK_URL),
  resendApiKey: () => clean(process.env.RESEND_API_KEY),
  contactToEmail: () => clean(process.env.CONTACT_TO_EMAIL),
  contactFromEmail: () => clean(process.env.CONTACT_FROM_EMAIL) ?? 'noreply@example.invalid',
  /** CRM endpoint for calculator leads. See lib/calculator/crm.ts. */
  calculatorCrmUrl: () => asUrl(process.env.CALCULATOR_CRM_URL),
  calculatorCrmToken: () => clean(process.env.CALCULATOR_CRM_TOKEN),
};

export const __testing = { clean, asUrl };
