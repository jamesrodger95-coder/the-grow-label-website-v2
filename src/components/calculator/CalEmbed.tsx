'use client';

import { useEffect, useRef, useState } from 'react';
import { preconnect, preload } from 'react-dom';
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

/**
 * How long to wait before the new-tab link is promoted. Not a failure: on a
 * phone the embed fetches thirty-odd files and measured over twelve seconds in
 * Safari's engine before its spinner cleared, so it keeps loading behind the
 * promoted link and replaces the message if it arrives.
 */
const SLOW_AFTER = 7000;

/**
 * Starts the connection to Cal.com and fetches its loader early, while the
 * reader is still answering, so less of the wait lands after the last
 * question. Safe to call on every render; React dedupes the hints.
 */
export function warmCal(): void {
  preconnect(ORIGIN);
  preload(LOADER, { as: 'script' });
}

/**
 * Where "book in a new tab" goes: the booking URL if one is configured,
 * otherwise the same Cal.com event the embed shows. Never the contact page,
 * which on this site is the questionnaire again.
 */
export function bookingHref(bookingUrl?: string): string {
  return bookingUrl || `https://cal.com/${calLinkFrom(bookingUrl)}`;
}

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

type Status = 'loading' | 'ready' | 'slow';

export function CalEmbed({
  bookingUrl,
  hideDetails = false,
}: {
  bookingUrl?: string;
  /** Hide the event's title and description so only the calendar and slots show. */
  hideDetails?: boolean;
}) {
  const [status, setStatus] = useState<Status>('loading');
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;

    let cancelled = false;

    // The calendar has arrived when Cal marks its element `loading="done"`,
    // not when the element first appears: the iframe is inserted at once and
    // then shows Cal's own spinner for as long as the booking page takes,
    // which on a phone is the whole of the wait. Counting children called
    // that spinner "ready" and so never offered the link.
    const done = () => Boolean(frame.querySelector('cal-inline[loading="done"]'));
    const observer = new MutationObserver(() => {
      if (cancelled || !done()) return;
      setStatus('ready');
      observer.disconnect();
    });
    observer.observe(frame, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['loading'],
    });

    const deadline = setTimeout(() => {
      if (!cancelled && !done()) setStatus('slow');
    }, SLOW_AFTER);

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
          ns('ui', { hideEventTypeDetails: hideDetails, layout: 'month_view' });
        }
        // A remount lands in an element Cal has already filled.
        if (!cancelled && done()) setStatus('ready');
      } catch {
        if (!cancelled) setStatus('slow');
      }
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(started);
      observer.disconnect();
      clearTimeout(deadline);
    };
  }, [bookingUrl, hideDetails]);

  const href = bookingHref(bookingUrl);

  return (
    <div className="calembed" data-status={status}>
      {/* On a phone the booking page in its own tab is the quicker route, so
          it is offered first, above the embed, rather than under it. */}
      <a className="btn calembed__open" href={href} rel="noopener noreferrer" target="_blank">
        {RESULT.openCalendar}
        <span className="btn__arrow" aria-hidden="true">
          &rarr;
        </span>
      </a>

      <div className="calembed__frame" id={MOUNT_ID} ref={frameRef} data-status={status} />

      <p className="micro calembed__fallback" role={status === 'slow' ? 'status' : undefined}>
        {status === 'slow' ? RESULT.embedSlow : RESULT.embedFallback}{' '}
        <a className="tlink" href={href} rel="noopener noreferrer" target="_blank">
          {RESULT.bookCta}
          <span aria-hidden="true">&rarr;</span>
        </a>
      </p>
    </div>
  );
}
