import { describe, expect, it } from 'vitest';
import { calLinkFrom } from '@/components/calculator/CalEmbed';

/**
 * Which event the calendar books.
 *
 * It is derived from `NEXT_PUBLIC_BOOKING_URL` so the event is written down
 * once rather than twice, which makes this function the thing standing between
 * a changed booking link and a calendar quietly booking the old event. It
 * fails safe in every direction: anything it cannot read leaves the published
 * default in place, and the fallback link beside the calendar still works.
 */
describe('the Cal.com event link', () => {
  const DEFAULT = 'thegrowlabel/revenue-assessment';

  it('takes the event from a Cal.com booking URL', () => {
    expect(calLinkFrom('https://cal.com/thegrowlabel/revenue-assessment')).toBe(DEFAULT);
    expect(calLinkFrom('https://app.cal.com/thegrowlabel/discovery')).toBe(
      'thegrowlabel/discovery'
    );
    // Trailing and duplicated slashes are the usual copy-paste damage.
    expect(calLinkFrom('https://cal.com/thegrowlabel/revenue-assessment/')).toBe(DEFAULT);
  });

  it('keeps the default for anything that is not a Cal.com link', () => {
    expect(calLinkFrom('https://calendly.com/thegrowlabel/30min')).toBe(DEFAULT);
    expect(calLinkFrom('https://thegrowlabel.com/book')).toBe(DEFAULT);
    // A lookalike host must not be treated as Cal.com.
    expect(calLinkFrom('https://notcal.com/someone/event')).toBe(DEFAULT);
    expect(calLinkFrom('https://cal.com.example.net/someone/event')).toBe(DEFAULT);
  });

  it('keeps the default when there is nothing to read', () => {
    expect(calLinkFrom(undefined)).toBe(DEFAULT);
    expect(calLinkFrom('')).toBe(DEFAULT);
    expect(calLinkFrom('not a url')).toBe(DEFAULT);
    // A bare Cal.com origin names no event.
    expect(calLinkFrom('https://cal.com')).toBe(DEFAULT);
    expect(calLinkFrom('https://cal.com/')).toBe(DEFAULT);
  });
});
