import { describe, expect, it } from 'vitest';
import {
  COEFFICIENTS,
  DEFAULTS,
  RECORD_BANDS,
  VALUE_BANDS,
  appointmentsPerYear,
  bandLabel,
  estimate,
  representative,
  roundDownHundred,
  roundDownThousand,
  type Answers,
} from '@/lib/calculator/model';
import { QUESTIONS, answerLabel } from '@/content/calculator';

/**
 * The model is the part of this feature that must not drift.
 *
 * Every figure it produces becomes the anchor for a paid assessment that has to
 * be able to beat it, so these tests are written against literal expected
 * values rather than against the formula. A test that recomputes the formula
 * proves only that the formula equals itself; these fail if a coefficient
 * moves, which is the thing worth catching.
 */

/** The worked example from the brief: a four-location dental group. */
const SAMPLE: Answers = {
  practice: 'dental',
  locations: '4-7',
  records: '4000-10000',
  weeklyAppointments: 240,
  value: '200-400',
  desk: '4-6',
  calls: 'voicemail',
  noShows: 'not-sure',
  campaign: 'never',
};

describe('bands', () => {
  it('takes the midpoint of a closed band and the lower bound of an open one', () => {
    expect(representative({ min: 100, max: 200 })).toBe(150);
    expect(representative({ min: 0, max: 1500 })).toBe(750);
    expect(representative({ min: 800 })).toBe(800);
    expect(representative({ min: 10000 })).toBe(10000);
  });

  /**
   * An open-topped band taking its lower bound is the single most important
   * rule in the file: a practice at $2,000 an appointment is modelled at $800,
   * which is the direction this tool is required to be wrong in.
   */
  it('never lets an open-topped band model above its floor', () => {
    for (const band of [...Object.values(VALUE_BANDS), ...Object.values(RECORD_BANDS)]) {
      if (band.max === undefined) expect(representative(band)).toBe(band.min);
    }
  });

  it('formats a label from the same bounds the arithmetic uses', () => {
    expect(bandLabel(VALUE_BANDS['100-200'])).toBe('$100–$200');
    expect(bandLabel(VALUE_BANDS['under-100'])).toBe('under $100');
    expect(bandLabel(VALUE_BANDS['800-plus'])).toBe('$800+');
  });
});

describe('rounding', () => {
  it('only ever rounds down', () => {
    expect(roundDownThousand(287141.76)).toBe(287000);
    expect(roundDownThousand(999)).toBe(0);
    expect(roundDownHundred(33177.6)).toBe(33100);
    expect(roundDownThousand(-5)).toBe(0);
  });
});

describe('the worked example', () => {
  const result = estimate(SAMPLE);

  it('derives the spine from the weekly count', () => {
    expect(appointmentsPerYear(240)).toBe(11520);
    expect(result.appointmentsPerYear).toBe(11520);
    expect(result.appointmentValue).toBe(300);
    expect(result.activeRecords).toBe(7000);
  });

  it('resolves "not sure" to the practice-type default rather than the best case', () => {
    expect(result.noShowRate).toBe(DEFAULTS.dental.noShowRate);
    expect(result.noShowRate).toBe(0.15);
    // And the default is not the most favourable band available.
    expect(result.noShowRate).toBeGreaterThan(COEFFICIENTS.noShowRate['under-5']);
  });

  it('produces the four module figures the brief specifies', () => {
    const byModule = Object.fromEntries(result.modules.map((m) => [m.slug, Math.round(m.value)]));
    expect(byModule).toEqual({
      answer: 266112,
      respond: 33178,
      retain: 103680,
      reactivate: 75600,
    });
  });

  it('holds the headline at sixty per cent of the total, rounded down', () => {
    expect(Math.round(result.total)).toBe(478570);
    expect(result.upper).toBe(478000);
    expect(result.headline).toBe(287000);
    expect(result.headline).toBeLessThan(result.upper);
  });

  it('returns the front-desk hours behind it', () => {
    // 6,336 missed calls at 3 minutes, 1,728 no-shows at 5, 2,100 dormant at 2.
    expect(result.missedCalls).toBe(6336);
    expect(result.hoursReturned).toBe(530);
  });

  it('does not flag the record threshold above it', () => {
    expect(result.belowRecordThreshold).toBe(false);
    expect(estimate({ ...SAMPLE, records: 'under-1500' }).belowRecordThreshold).toBe(true);
  });
});

describe('conservatism', () => {
  const result = estimate(SAMPLE);

  it('keeps the headline beneath every intermediate figure it was built from', () => {
    expect(result.headline).toBeLessThanOrEqual(result.total * COEFFICIENTS.headlineShare);
    expect(result.upper).toBeLessThanOrEqual(result.total);
  });

  /**
   * The estimate is a share of gross appointment revenue. It is the ratio a
   * practice owner will sanity-check first, so it is the one asserted here:
   * if a coefficient is ever raised, this is what fails.
   */
  it('stays inside a defensible share of modelled gross revenue', () => {
    const gross = result.appointmentsPerYear * result.appointmentValue;
    expect(result.headline / gross).toBeLessThan(0.1);
    expect(result.upper / gross).toBeLessThan(0.15);
  });

  it('never exceeds the answering-service case when calls are already covered', () => {
    const voicemail = estimate({ ...SAMPLE, calls: 'voicemail' });
    const covered = estimate({ ...SAMPLE, calls: 'answering-service' });
    expect(covered.headline).toBeLessThan(voicemail.headline);
  });

  it('shrinks the reactivation figure as the list is worked more recently', () => {
    const order = (['never', 'over-12', '6-12', 'under-6'] as const).map(
      (campaign) =>
        estimate({ ...SAMPLE, campaign }).modules.find((m) => m.slug === 'reactivate')?.value ?? 0
    );
    expect(order).toEqual([...order].sort((a, b) => b - a));
    expect(new Set(order).size).toBe(4);
  });

  /**
   * The form will not submit a zero, but the model is the thing under test and
   * it has to hold on its own. Three of the four modules are driven by
   * appointment volume and collapse to nothing; reactivation is driven by the
   * record count, so it survives — which is correct, and worth pinning down so
   * a future guard clause does not quietly zero it too.
   */
  it('collapses the volume-driven modules on an empty appointment count', () => {
    const empty = estimate({ ...SAMPLE, weeklyAppointments: 0 });
    expect(Number.isNaN(empty.total)).toBe(false);
    for (const slug of ['answer', 'respond', 'retain'] as const) {
      expect(empty.modules.find((m) => m.slug === slug)?.value).toBe(0);
    }
    expect(empty.modules.find((m) => m.slug === 'reactivate')?.value).toBeGreaterThan(0);
    expect(empty.headline).toBeLessThan(estimate(SAMPLE).headline);
  });
});

describe('the questions', () => {
  it('asks nine, one per answer the model needs', () => {
    expect(QUESTIONS).toHaveLength(9);
    const ids = QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(9);
    for (const key of Object.keys(SAMPLE)) expect(ids).toContain(key);
  });

  /**
   * Software and PMS questions belong in the paid assessment. Asking them here
   * costs completions and buys nothing the assessment does not read from the
   * source anyway.
   */
  it('asks for no system, vendor or software detail', () => {
    const text = QUESTIONS.map((q) => `${q.title} ${q.help ?? ''}`)
      .join(' ')
      .toLowerCase();
    for (const word of ['software', 'pms', 'practice management system', 'crm', 'vendor']) {
      expect(text).not.toContain(word);
    }
  });

  it('labels every answer it can be given', () => {
    for (const question of QUESTIONS) {
      if (question.kind === 'number') {
        expect(answerLabel(question.id, 240)).toContain('240');
        continue;
      }
      for (const option of question.options) {
        expect(answerLabel(question.id, option.value)).toBe(option.label);
      }
    }
  });

  it('holds the med spa defaults at or below the dental ones', () => {
    expect(DEFAULTS['med-spa'].noShowRate).toBeLessThanOrEqual(DEFAULTS.dental.noShowRate);
    expect(DEFAULTS['med-spa'].lapseRate).toBeLessThanOrEqual(DEFAULTS.dental.lapseRate);
  });

  it('opens on the appointment value band that matches the practice type', () => {
    for (const practice of ['veterinary', 'dental', 'med-spa'] as const) {
      const band = DEFAULTS[practice].value;
      expect(Object.keys(VALUE_BANDS)).toContain(band);
    }
    // The two defaults are deliberately different; a shared one would mean the
    // first question changed nothing.
    expect(DEFAULTS.dental.value).not.toBe(DEFAULTS.veterinary.value);
  });
});
