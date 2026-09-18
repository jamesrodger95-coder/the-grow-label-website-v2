import { describe, expect, it } from 'vitest';
import { estimate, money, type Answers } from '@/lib/calculator/model';

/**
 * The sanity check, kept as a test rather than as a one-off script.
 *
 * These are not assertions about correctness — `calculator-model.test.ts` does
 * that. They are the ratios a practice owner checks in their head before they
 * believe a number, printed so the shape of the model stays visible: what share
 * of gross revenue the headline claims, and how much of it rests on one module.
 *
 * If a coefficient is ever revisited, run this first. A model whose headline is
 * half of one module is a model with a single point of failure, and that is a
 * thing to know before the estimate is in front of a prospect rather than after.
 */

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

type Shape = {
  label: string;
  headline: string;
  shareOfGross: number;
  largestModuleShare: number;
  extraAppointments: number;
};

function shape(label: string, answers: Answers): Shape {
  const result = estimate(answers);
  const gross = result.appointmentsPerYear * result.appointmentValue;
  const largest = Math.max(...result.modules.map((m) => m.value));
  return {
    label,
    headline: money(result.headline),
    shareOfGross: Number((result.headline / gross).toFixed(4)),
    largestModuleShare: Number((largest / result.total).toFixed(3)),
    // What the headline implies in appointments, which is the unit an owner
    // actually reasons in.
    extraAppointments: Math.round(result.headline / result.appointmentValue),
  };
}

describe('the shape of the estimate', () => {
  const cases: Shape[] = [
    shape('worked example — dental, voicemail, never campaigned', SAMPLE),
    shape('the same practice, answering service', { ...SAMPLE, calls: 'answering-service' }),
    shape('the same practice, "not sure" on calls', { ...SAMPLE, calls: 'not-sure' }),
    shape('the same practice, campaigned in the last six months', {
      ...SAMPLE,
      campaign: 'under-6',
    }),
    shape('single-site veterinary, small list', {
      practice: 'veterinary',
      locations: '1',
      records: '1500-4000',
      weeklyAppointments: 90,
      value: '100-200',
      desk: '2-3',
      calls: 'not-sure',
      noShows: 'not-sure',
      campaign: 'over-12',
    }),
  ];

  it('claims a defensible share of gross revenue in every configuration', () => {
    for (const row of cases) {
      // Never more than a tenth of what the practice bills, on the headline.
      expect(row.shareOfGross, row.label).toBeLessThan(0.1);
      expect(row.shareOfGross, row.label).toBeGreaterThan(0);
    }
  });

  /**
   * ANSWER dominates, and that is the model's single biggest exposure: it is
   * the one module whose inputs a practice cannot check against a report,
   * because an unanswered call leaves no record. The threshold is set where it
   * is so that a coefficient change that made it dominant fails here.
   */
  it('does not let one module carry more than two thirds of the total', () => {
    for (const row of cases) {
      expect(row.largestModuleShare, row.label).toBeLessThan(0.67);
    }
  });

  it('prints the shape, so the ratios are reviewable rather than implied', () => {
    console.table(cases);
    expect(cases).toHaveLength(5);
  });
});
