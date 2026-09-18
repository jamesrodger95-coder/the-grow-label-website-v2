'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RESULT } from '@/content/calculator';
import type { Answers } from '@/lib/calculator/model';

/**
 * The ask.
 *
 * The answers are sent to us first and the reader goes to the booking page
 * second, in that order and never the other way round: a prospect who answers
 * nine questions and then abandons the Cal.com page is still a lead, and the
 * answers are the whole of what we need to build their assessment.
 *
 * Delivery is best-effort on purpose. If the lead cannot be sent — no
 * destination configured, our endpoint down, the request blocked — the reader
 * still goes to the booking page. Nothing about our own plumbing is worth
 * standing between somebody and a booking, and the booking itself carries
 * their name and email whatever happens here.
 */
export function BookCall({ answers, bookingUrl }: { answers: Answers; bookingUrl?: string }) {
  const [sending, setSending] = useState(false);

  if (!bookingUrl) {
    return (
      <div className="calc__book">
        <div className="form__status" role="status">
          <p className="label" style={{ marginBottom: 10 }}>
            Booking unavailable
          </p>
          <p className="small">{RESULT.unbooked}</p>
        </div>
        <Link className="btn" href="/contact">
          Request an assessment
          <span className="btn__arrow" aria-hidden="true">
            &rarr;
          </span>
        </Link>
      </div>
    );
  }

  async function book() {
    if (sending) return;
    setSending(true);

    let reference = '';
    try {
      const res = await fetch('/api/calculator/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const result = (await res.json()) as { status: string; reference?: string };
      if (result.status === 'success' && result.reference) reference = result.reference;
    } catch {
      // Best effort. The booking matters more than our own record of it.
    }

    // The reference travels with the booking so the assessment we have already
    // built can be matched to whoever turns up. Cal.com carries through any
    // query parameter it does not recognise.
    const target = new URL(bookingUrl as string);
    if (reference) target.searchParams.set('reference', reference);
    window.location.href = target.toString();
  }

  return (
    <div className="calc__book">
      <ul className="ticks calc__gets">
        {RESULT.whatYouGet.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="calc__bookaction">
        <button className="btn" type="button" onClick={book} disabled={sending}>
          {sending ? RESULT.bookPreparing : RESULT.bookCta}
          <span className="btn__arrow" aria-hidden="true">
            &rarr;
          </span>
        </button>
        <p className="micro calc__booknote">{RESULT.bookNote}</p>
      </div>
    </div>
  );
}
