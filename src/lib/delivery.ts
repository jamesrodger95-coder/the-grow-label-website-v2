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

/**
 * One outgoing message, already shaped for both providers: the JSON body a
 * webhook receives, and the subject, text and reply address an email needs.
 * The contact form and the /AI sample request both go through this, so there
 * is one delivery path and one place to add a provider.
 */
export type OutgoingMessage = {
  webhook: Record<string, unknown>;
  subject: string;
  text: string;
  replyTo: string;
};

async function sendWebhook(url: string, body: Record<string, unknown>) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
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

async function sendEmail(message: Pick<OutgoingMessage, 'subject' | 'text' | 'replyTo'>) {
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
        reply_to: message.replyTo,
        subject: message.subject,
        text: message.text,
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

/** Sends a message built for a reference, through whichever provider is set. */
export async function deliverMessage(
  build: (reference: string) => OutgoingMessage
): Promise<DeliveryOutcome> {
  const mode = deliveryMode();
  if (mode === 'unconfigured') return { delivered: false, reason: 'unconfigured' };

  const reference = buildReference();
  const message = build(reference);

  if (mode === 'webhook') {
    const url = serverEnv.contactWebhookUrl();
    if (!url) return { delivered: false, reason: 'unconfigured' };
    const result = await sendWebhook(url, message.webhook);
    return result.ok
      ? { delivered: true, reference, via: 'webhook' }
      : { delivered: false, reason: 'provider-error', detail: result.detail };
  }

  const result = await sendEmail(message);
  return result.ok
    ? { delivered: true, reference, via: 'email' }
    : { delivered: false, reason: 'provider-error', detail: result.detail };
}

export function deliver(input: ContactInput): Promise<DeliveryOutcome> {
  return deliverMessage((reference) => ({
    webhook: {
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
    },
    subject: `Assessment request — ${input.organisation} [${reference}]`,
    text: formatSubmission(input, reference),
    replyTo: input.email,
  }));
}
