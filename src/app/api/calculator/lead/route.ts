import { NextResponse } from 'next/server';
import type { LeadResult } from '@/lib/calculator/lead-fields';
import { leadSchema } from '@/lib/calculator/lead-schema';
import { estimate, roundDownHundred } from '@/lib/calculator/model';
import { deliverLead } from '@/lib/calculator/crm';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import { leadDeliveryConfigured } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Calculator lead capture.
 *
 * The estimate is recomputed here from the nine validated answers rather than
 * accepted from the client, so what reaches the CRM is what the model produces
 * for those answers and not what a posted payload claimed it produced.
 *
 * The report itself is built in the browser and does not pass through this
 * route. A lead that cannot be delivered therefore costs the person nothing —
 * which is why the failure paths below say plainly that nothing was sent
 * instead of quietly accepting it.
 */

function json(body: LeadResult, status: number, extraHeaders?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: { 'cache-control': 'no-store', ...extraHeaders },
  });
}

const UNCONFIGURED =
  'This site has no lead destination configured, so nothing was sent and nothing was stored.';

export async function POST(request: Request): Promise<NextResponse> {
  const limit = rateLimit(`calculator:${clientKey(request.headers)}`);
  if (!limit.ok) {
    return json(
      {
        status: 'error',
        message: 'Too many requests from this connection. Try again shortly.',
      },
      429,
      { 'retry-after': String(limit.retryAfterSeconds) }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ status: 'error', message: 'The request could not be read.' }, 400);
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ status: 'error', message: 'This request could not be accepted.' }, 400);
  }

  const input = parsed.data;

  // Honeypot: rejected, and never confirmed as success.
  if (input.website) {
    return json({ status: 'error', message: 'This request could not be accepted.' }, 400);
  }

  if (!leadDeliveryConfigured()) {
    return json({ status: 'unconfigured', message: UNCONFIGURED }, 503);
  }

  const result = estimate(input.answers);

  const outcome = await deliverLead({
    source: 'grow-label-website/calculator',
    submittedAt: new Date().toISOString(),
    email: input.email || undefined,
    practiceName: input.practiceName || undefined,
    answers: input.answers,
    // The figures the reader was NOT shown. They are the substance of the call,
    // and they are recomputed here rather than accepted from the browser, so a
    // payload edited in the console produces a corrected figure and not a
    // fabricated one.
    estimate: {
      headline: result.headline,
      upper: result.upper,
      hoursReturned: result.hoursReturned,
      appointmentsPerYear: result.appointmentsPerYear,
      appointmentValue: result.appointmentValue,
      modules: result.modules.map((m) => ({ slug: m.slug, value: roundDownHundred(m.value) })),
    },
  });

  if (outcome.delivered) {
    return json({ status: 'success', reference: outcome.reference }, 200);
  }

  if (outcome.reason === 'unconfigured') {
    return json({ status: 'unconfigured', message: UNCONFIGURED }, 503);
  }

  console.error('[calculator] lead delivery failed:', outcome.detail);
  return json(
    {
      status: 'error',
      message: 'Your details could not be sent, so nothing was stored. Please try again shortly.',
    },
    502
  );
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { configured: leadDeliveryConfigured() },
    { headers: { 'cache-control': 'no-store' } }
  );
}
