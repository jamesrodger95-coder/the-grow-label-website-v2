'use client';

import Link from 'next/link';
import { RESULT } from '@/content/calculator';

/**
 * The Cal.com booking embed.
 *
 * ── PASTE THE EMBED HERE ────────────────────────────────────────────────────
 *
 * Cal.com's inline snippet is a `<script>` that initialises `Cal` and then
 * mounts a calendar into an element by selector. In this app that means:
 *
 *   1. Add `import Script from 'next/script'` above.
 *   2. Drop their `(function(C,A,L){…})` bootstrap into a
 *      `<Script id="cal-embed" strategy="afterInteractive">{`…`}</Script>`.
 *   3. Point their `Cal("inline", { elementOrSelector: "#cal-booking", … })`
 *      at the div below, which already has that id and is already sized.
 *
 * Keep two things when you do:
 *
 *   • The fallback. If the script is blocked — and on a corporate network it
 *     sometimes is — the link below is the only way a reader can still book.
 *     Leave it rendered underneath rather than swapping it out.
 *   • The lead POST stays where it is, in `Result`, firing when the questions
 *     finish. It must not be attached to a click on the calendar: with an
 *     embed there is no click to attach it to, and the answers are the whole
 *     of what we need whether or not a booking follows.
 *
 * The event type's redirect should point at `/assessment-booked`.
 * ────────────────────────────────────────────────────────────────────────────
 */
export function CalEmbed({ bookingUrl }: { bookingUrl?: string }) {
  return (
    <div className="calembed">
      <div className="calembed__head">
        <p className="label label--accent">{RESULT.embedLabel}</p>
        <p className="small calembed__note">{RESULT.embedNote}</p>
      </div>

      {/* The calendar mounts here. Until it does, the slot carries its own
          instruction rather than an empty box a reader has to interpret. */}
      <div className="calembed__frame" id="cal-booking">
        <div className="calembed__placeholder">
          <p className="label">{RESULT.embedPending}</p>
          <p className="small calembed__pendingnote">{RESULT.embedPendingNote}</p>
          {bookingUrl ? (
            <a className="btn" href={bookingUrl} rel="noopener noreferrer" target="_blank">
              {RESULT.bookCta}
              <span className="btn__arrow" aria-hidden="true">
                &rarr;
              </span>
            </a>
          ) : (
            <Link className="btn" href="/contact">
              {RESULT.unbookedCta}
              <span className="btn__arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
