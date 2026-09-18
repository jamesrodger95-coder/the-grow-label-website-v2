'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { RESULT } from '@/content/calculator';

/**
 * The Cal.com booking calendar.
 *
 * The snippet Cal.com hands out is a script tag. This is that snippet, ported
 * so it survives the one thing a pasted script tag does not: this component
 * mounts when the ninth question is answered and unmounts again if the reader
 * goes back to change one. A `<script>` runs once per document, so the second
 * time round the calendar would never come back. Running it from an effect
 * means `inline()` is called against whatever element is on screen now.
 *
 * The namespace, the event link and the layout are exactly as given:
 *
 *   Cal("init", "revenue-assessment", { origin: "https://app.cal.com" })
 *   Cal.ns["revenue-assessment"]("inline", { … calLink: "thegrowlabel/revenue-assessment" })
 *   Cal.ns["revenue-assessment"]("ui", { hideEventTypeDetails: false, layout: "month_view" })
 *
 * Two things around it that are not in the snippet and matter:
 *
 *   • The CSP. The site ships no other third-party script, so `/calculator` is
 *     the only route where script-src, connect-src and frame-src name Cal.com.
 *     See next.config.ts. If the calendar is ever moved to another route, that
 *     header moves with it or the iframe is blocked.
 *   • The fallback. A corporate network that blocks app.cal.com leaves an empty
 *     box and a reader with no way to book, so the link below the frame is
 *     always rendered, and the copy changes to lead with it once the calendar
 *     has visibly failed to arrive.
 */

type CalQueue = {
  (...args: unknown[]): void;
  loaded?: boolean;
  ns?: Record<string, (...args: unknown[]) => void>;
  q?: unknown[][];
  config?: { forwardQueryParams?: boolean };
};

declare global {
  interface Window {
    Cal?: CalQueue;
  }
}

const NAMESPACE = 'revenue-assessment';
/** Used only when `NEXT_PUBLIC_BOOKING_URL` is absent or is not a Cal.com link. */
const FALLBACK_CAL_LINK = 'thegrowlabel/revenue-assessment';
const ORIGIN = 'https://app.cal.com';
const LOADER = 'https://app.cal.com/embed/embed.js';
const MOUNT_ID = 'my-cal-inline-revenue-assessment';

/** How long to wait for the iframe before offering the link instead. */
const GIVE_UP_AFTER = 8000;

/**
 * Cal's bootstrap, transcribed.
 *
 * It installs a queue on `window.Cal` and appends the real embed script once;
 * calls made before that script arrives are replayed when it does. Kept
 * faithful to the published snippet rather than tidied, because this is the
 * part a future Cal.com update will replace wholesale.
 */
function installCal(): CalQueue {
  const existing = window.Cal;
  if (existing) return existing;

  const push = (target: { q?: unknown[][] }, args: unknown) => {
    target.q = target.q ?? [];
    target.q.push(args as unknown[]);
  };

  const cal: CalQueue = function cal(...args: unknown[]) {
    const self = window.Cal as CalQueue;
    if (!self.loaded) {
      self.ns = {};
      self.q = self.q ?? [];
      document.head.appendChild(document.createElement('script')).src = LOADER;
      self.loaded = true;
    }
    if (args[0] === 'init') {
      const api = function api(...inner: unknown[]) {
        push(api as unknown as { q?: unknown[][] }, inner);
      } as CalQueue;
      const namespace = args[1];
      api.q = api.q ?? [];
      if (typeof namespace === 'string') {
        self.ns = self.ns ?? {};
        self.ns[namespace] = self.ns[namespace] ?? api;
        push(self.ns[namespace] as unknown as { q?: unknown[][] }, args);
        push(self, ['initNamespace', namespace]);
      } else {
        push(self, args);
      }
      return;
    }
    push(self, args);
  } as CalQueue;

  window.Cal = cal;
  return cal;
}

/**
 * The event this page books, taken from the booking URL rather than written
 * down twice.
 *
 * `NEXT_PUBLIC_BOOKING_URL` already drives the footer and the fallback link, so
 * holding the same fact here as a constant would mean changing the event in two
 * places and finding out about the one you missed from a prospect. Anything
 * that is not a Cal.com link — a Calendly URL, a booking page of our own —
 * leaves the calendar on its default and the fallback link still works.
 */
export function calLinkFrom(bookingUrl?: string): string {
  if (!bookingUrl) return FALLBACK_CAL_LINK;
  try {
    const url = new URL(bookingUrl);
    if (!/(^|\.)cal\.com$/.test(url.hostname)) return FALLBACK_CAL_LINK;
    const path = url.pathname.replace(/^\/+|\/+$/g, '');
    return path.length > 0 ? path : FALLBACK_CAL_LINK;
  } catch {
    return FALLBACK_CAL_LINK;
  }
}

type Status = 'loading' | 'ready' | 'failed';

export function CalEmbed({ bookingUrl }: { bookingUrl?: string }) {
  const [status, setStatus] = useState<Status>('loading');
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;

    let cancelled = false;

    // The calendar has arrived when something is inside the mount point. An
    // observer rather than a poll, and a deadline so a blocked script ends in
    // a usable state rather than a spinner that never resolves.
    const observer = new MutationObserver(() => {
      if (cancelled || frame.childElementCount === 0) return;
      setStatus('ready');
      observer.disconnect();
    });
    observer.observe(frame, { childList: true });

    const deadline = setTimeout(() => {
      if (!cancelled && frame.childElementCount === 0) setStatus('failed');
    }, GIVE_UP_AFTER);

    // Cal is started on the next frame rather than in the effect body, so both
    // outcomes — a calendar or a failure — report through a callback.
    const started = requestAnimationFrame(() => {
      try {
        const Cal = installCal();
        Cal('init', NAMESPACE, { origin: ORIGIN });
        Cal.config = Cal.config ?? {};
        // Carries our own query string through to the booking, which is how a
        // reference on this page's URL reaches the booking record.
        Cal.config.forwardQueryParams = true;

        const ns = Cal.ns?.[NAMESPACE];
        if (ns) {
          ns('inline', {
            elementOrSelector: `#${MOUNT_ID}`,
            config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true' },
            calLink: calLinkFrom(bookingUrl),
          });
          ns('ui', { hideEventTypeDetails: false, layout: 'month_view' });
        }
        // A remount lands in an element Cal has already filled.
        if (!cancelled && frame.childElementCount > 0) setStatus('ready');
      } catch {
        if (!cancelled) setStatus('failed');
      }
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(started);
      observer.disconnect();
      clearTimeout(deadline);
    };
  }, [bookingUrl]);

  return (
    <div className="calembed">
      <div className="calembed__head">
        <p className="label label--accent">{RESULT.embedLabel}</p>
        <p className="small calembed__note">{RESULT.embedNote}</p>
      </div>

      <div className="calembed__frame" id={MOUNT_ID} ref={frameRef} data-status={status} />

      <p className="micro calembed__fallback">
        {status === 'failed' ? RESULT.embedFailed : RESULT.embedFallback}{' '}
        {bookingUrl ? (
          <a className="tlink" href={bookingUrl} rel="noopener noreferrer" target="_blank">
            {RESULT.bookCta}
            <span aria-hidden="true">&rarr;</span>
          </a>
        ) : (
          <Link className="tlink" href="/contact">
            {RESULT.unbookedCta}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        )}
      </p>
    </div>
  );
}
