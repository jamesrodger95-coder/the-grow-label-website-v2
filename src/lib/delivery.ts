import 'server-only';

import { deliveryMode, serverEnv, type DeliveryMode } from './env';
import { SECTOR_LABELS, SITE_LABELS, type ContactInput } from './contact-fields';

/**
 * Delivery provider adapter.
 *
 * Two adapters ship: a generic webhook and Resend. When neither is configured
 * the route returns an explicit `unconfigured` result — it never pretends a
 * message was delivered.
 */

export type DeliveryOutcome =
  | { delivered: true; reference: string; via: Exclude<DeliveryMode, 'unconfigured'> }
  | { delivered: false; reason: 'unconfigured' }
  | { delivered: false; reason: 'provider-error'; detail: string };

export function buildReference(now = new Date()): string {
  const stamp = now.toISOString().slice(2, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `GL-${stamp}-${rand}`;
}

export function formatSubmission(input: ContactInput, reference: string): string {
  return [
    `Reference: ${reference}`,
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Organisation: ${input.organisation}`,
    input.role ? `Role: ${input.role}` : null,
    `Sector: ${SECTOR_LABELS[input.sector]}`,
    `Sites: ${SITE_LABELS[input.sites]}`,
    '',
    'What they want to recover:',
    input.message,
  ]
    .filter((line): line is string => line !== null)
    .join('\n');
}

async function sendWebhook(url: string, input: ContactInput, reference: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        reference,
        source: 'grow-label-website',
        submittedAt: new Date().toISOString(),
        name: input.name,
        email: input.email,
        organisation: input.organisation,
        role: input.role || undefined,
        sector: input.sector,
        sites: input.sites,
        message: input.message,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      return { ok: false as const, detail: `webhook responded ${res.status}` };
    }
    return { ok: true as const };
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'unknown webhook error';
    return { ok: false as const, detail };
  } finally {
    clearTimeout(timeout);
  }
}

async function sendEmail(input: ContactInput, reference: string) {
  const apiKey = serverEnv.resendApiKey();
  const to = serverEnv.contactToEmail();
  if (!apiKey || !to) return { ok: false as const, detail: 'email provider not configured' };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: serverEnv.contactFromEmail(),
        to: [to],
        reply_to: input.email,
        subject: `Assessment request — ${input.organisation} [${reference}]`,
        text: formatSubmission(input, reference),
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      return { ok: false as const, detail: `email provider responded ${res.status}` };
    }
    return { ok: true as const };
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'unknown email error';
    return { ok: false as const, detail };
  } finally {
    clearTimeout(timeout);
  }
}

export async function deliver(input: ContactInput): Promise<DeliveryOutcome> {
  const mode = deliveryMode();
  if (mode === 'unconfigured') return { delivered: false, reason: 'unconfigured' };

  const reference = buildReference();

  if (mode === 'webhook') {
    const url = serverEnv.contactWebhookUrl();
    if (!url) return { delivered: false, reason: 'unconfigured' };
    const result = await sendWebhook(url, input, reference);
    return result.ok
      ? { delivered: true, reference, via: 'webhook' }
      : { delivered: false, reason: 'provider-error', detail: result.detail };
  }

  const result = await sendEmail(input, reference);
  return result.ok
    ? { delivered: true, reference, via: 'email' }
    : { delivered: false, reason: 'provider-error', detail: result.detail };
}
