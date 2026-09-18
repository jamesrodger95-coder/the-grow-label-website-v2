import 'server-only';

import { serverEnv } from '@/lib/env';
import type { Answers } from './model';

/**
 * Where a calculator lead goes.
 *
 * ── Wiring this up ──────────────────────────────────────────────────────────
 *
 * Set `CALCULATOR_CRM_URL` to an endpoint that accepts a JSON POST, and
 * optionally `CALCULATOR_CRM_TOKEN`, which is sent as `authorization: Bearer …`.
 * The body is the `LeadPayload` type below, and nothing else: it is a stable
 * contract, so a change to the questions changes `answers` and leaves every
 * other key where it was.
 *
 * With neither variable set, and no contact webhook to fall back on, the route
 * returns `unconfigured` and the interface says so. It never reports a lead as
 * captured when nothing left the building — the same rule the assessment form
 * follows, and the reason there is no silent success path in this file.
 *
 * If your CRM needs a shape this does not produce, replace `postJson` rather
 * than reaching into the route: the route knows about `deliverLead` and nothing
 * else.
 */

export type LeadEstimateSummary = {
  /** The figure shown large, already rounded down. */
  headline: number;
  /** Top of the modelled range, already rounded down. */
  upper: number;
  hoursReturned: number;
  /** Per module, rounded down to the nearest hundred, in module order. */
  modules: { slug: string; value: number }[];
};

export type LeadPayload = {
  /** Always "grow-label-website/calculator". Lets a CRM route by source. */
  source: string;
  /** ISO 8601, UTC. */
  submittedAt: string;
  /** Opaque reference, also shown to the person who filled the form in. */
  reference: string;
  email: string;
  /** Practice name, when it was given. Optional on the form by design. */
  practiceName?: string;
  /** The nine answers exactly as the model received them. */
  answers: Answers;
  estimate: LeadEstimateSummary;
};

export type LeadOutcome =
  | { delivered: true; reference: string }
  | { delivered: false; reason: 'unconfigured' }
  | { delivered: false; reason: 'provider-error'; detail: string };

export function buildLeadReference(now = new Date()): string {
  const stamp = now.toISOString().slice(2, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `GL-C-${stamp}-${rand}`;
}

/** Eight seconds, matching the contact adapter. A CRM that is slower is down. */
const TIMEOUT_MS = 8000;

async function postJson(
  url: string,
  body: LeadPayload,
  token?: string
): Promise<{ ok: true } | { ok: false; detail: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) return { ok: false, detail: `crm responded ${res.status}` };
    return { ok: true };
  } catch (error) {
    return { ok: false, detail: error instanceof Error ? error.message : 'unknown crm error' };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Sends the lead, or says plainly that it could not.
 *
 * Order of preference: the dedicated CRM endpoint, then the contact webhook if
 * one is configured — a deployment that can already receive an assessment
 * request can receive a calculator lead without any further configuration.
 * Email is deliberately not a fallback here: a lead is structured data and an
 * inbox is where structure goes to die.
 */
export async function deliverLead(payload: Omit<LeadPayload, 'reference'>): Promise<LeadOutcome> {
  const url = serverEnv.calculatorCrmUrl() ?? serverEnv.contactWebhookUrl();
  if (!url) return { delivered: false, reason: 'unconfigured' };

  const reference = buildLeadReference();
  const result = await postJson(url, { ...payload, reference }, serverEnv.calculatorCrmToken());

  return result.ok
    ? { delivered: true, reference }
    : { delivered: false, reason: 'provider-error', detail: result.detail };
}
