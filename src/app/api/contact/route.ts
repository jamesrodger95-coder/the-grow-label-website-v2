import { NextResponse } from 'next/server';
import { contactSchema, toFieldErrors, type ContactResult } from '@/lib/contact-schema';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import { deliver } from '@/lib/delivery';
import { deliveryMode } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Minimum time a genuine person needs to fill the form, in milliseconds. */
const MIN_ELAPSED_MS = 2500;

function json(body: ContactResult, status: number, extraHeaders?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: { 'cache-control': 'no-store', ...extraHeaders },
  });
}

export async function POST(request: Request): Promise<NextResponse> {
  // --- Rate-limit boundary ------------------------------------------------
  const limit = rateLimit(`contact:${clientKey(request.headers)}`);
  if (!limit.ok) {
    return json(
      {
        status: 'error',
        message: 'Too many requests from this connection. Try again shortly, or email us directly.',
      },
      429,
      { 'retry-after': String(limit.retryAfterSeconds) }
    );
  }

  // --- Parse --------------------------------------------------------------
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ status: 'error', message: 'The request could not be read.' }, 400);
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return json(
      {
        status: 'error',
        message: 'Some details need correcting before this can be sent.',
        fieldErrors: toFieldErrors(parsed.error),
      },
      400
    );
  }

  const input = parsed.data;

  // --- Honeypot: silently reject, but never confirm success ---------------
  if (input.website) {
    return json({ status: 'error', message: 'This request could not be accepted.' }, 400);
  }

  // --- Timing check -------------------------------------------------------
  if (typeof input.elapsed === 'number' && input.elapsed < MIN_ELAPSED_MS) {
    return json({ status: 'error', message: 'This request could not be accepted.' }, 400);
  }

  // --- Delivery -----------------------------------------------------------
  if (deliveryMode() === 'unconfigured') {
    return json(
      {
        status: 'unconfigured',
        message:
          'This site has no delivery provider configured, so nothing was sent. Your details were not stored.',
      },
      503
    );
  }

  const outcome = await deliver(input);

  if (outcome.delivered) {
    return json({ status: 'success', reference: outcome.reference }, 200);
  }

  if (outcome.reason === 'unconfigured') {
    return json(
      {
        status: 'unconfigured',
        message:
          'This site has no delivery provider configured, so nothing was sent. Your details were not stored.',
      },
      503
    );
  }

  console.error('[contact] delivery failed:', outcome.detail);
  return json(
    {
      status: 'error',
      message: 'The request could not be delivered. Nothing was sent — please try again shortly.',
    },
    502
  );
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { configured: deliveryMode() !== 'unconfigured' },
    { headers: { 'cache-control': 'no-store' } }
  );
}
