import { NextResponse } from 'next/server';
import { BUSINESS_OPTIONS, STUDIO_SAMPLE } from '@/content/studio';
import { deliverMessage } from '@/lib/delivery';
import { deliveryMode } from '@/lib/env';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import { SAMPLE_PREFERENCE_LABELS, type SampleResult } from '@/lib/sample-fields';
import { sampleSchema, toSampleFieldErrors } from '@/lib/sample-schema';

/**
 * The /AI free-sample request.
 *
 * Same boundary as /api/contact and the same delivery provider: a rate limit,
 * a honeypot, a minimum fill time, and an explicit `unconfigured` answer when
 * no provider is set. It never reports a success it did not have.
 *
 * The webhook body carries `kind: 'ai-sample-request'` so an automation that
 * already receives assessment requests can tell the two apart.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MIN_ELAPSED_MS = 2500;

function json(body: SampleResult, status: number, extraHeaders?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: { 'cache-control': 'no-store', ...extraHeaders },
  });
}

const UNCONFIGURED: SampleResult = {
  status: 'unconfigured',
  message: STUDIO_SAMPLE.unconfigured.body,
};

export async function POST(request: Request): Promise<NextResponse> {
  const limit = rateLimit(`sample:${clientKey(request.headers)}`);
  if (!limit.ok) {
    return json(
      { status: 'error', message: 'Too many requests from this connection. Try again shortly.' },
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

  const parsed = sampleSchema.safeParse(payload);
  if (!parsed.success) {
    return json(
      {
        status: 'error',
        message: STUDIO_SAMPLE.errors.generic,
        fieldErrors: toSampleFieldErrors(parsed.error),
      },
      400
    );
  }

  const input = parsed.data;
  if (input.hp) {
    return json({ status: 'error', message: 'This request could not be accepted.' }, 400);
  }
  if (typeof input.elapsed === 'number' && input.elapsed < MIN_ELAPSED_MS) {
    return json({ status: 'error', message: 'This request could not be accepted.' }, 400);
  }

  if (deliveryMode() === 'unconfigured') return json(UNCONFIGURED, 503);

  const preference = SAMPLE_PREFERENCE_LABELS[input.preference];
  const business =
    BUSINESS_OPTIONS.find((o) => o.value === input.business)?.label ?? input.business;
  const outcome = await deliverMessage((reference) => ({
    webhook: {
      reference,
      kind: 'ai-sample-request',
      source: 'grow-label-website/AI',
      submittedAt: new Date().toISOString(),
      name: input.name,
      email: input.email,
      brand: input.brand,
      business: input.business,
      productUrl: input.productUrl,
      preference: input.preference,
    },
    subject: `Free sample request: ${input.brand} [${reference}]`,
    text: [
      `Reference: ${reference}`,
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Company or website: ${input.brand}`,
      `Business: ${business}`,
      `Page to feature: ${input.productUrl}`,
      `Preferred sample: ${preference}`,
    ].join('\n'),
    replyTo: input.email,
  }));

  if (outcome.delivered) return json({ status: 'success', reference: outcome.reference }, 200);
  if (outcome.reason === 'unconfigured') return json(UNCONFIGURED, 503);

  console.error('[sample] delivery failed:', outcome.detail);
  return json(
    {
      status: 'error',
      message: 'The request could not be delivered and nothing was sent. Please try again shortly.',
    },
    502
  );
}
