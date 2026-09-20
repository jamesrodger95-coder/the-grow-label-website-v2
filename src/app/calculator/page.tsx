import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/motion/Reveal';
import { Calculator } from '@/components/calculator/Calculator';
import { Journey } from '@/components/calculator/Journey';
import { ActionLink, SectionHeader, TextLink } from '@/components/primitives';
import { CALCULATOR } from '@/content/calculator';
import { bookingUrl } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Revenue recovery assessment',
  description:
    'Step one of three. Nine questions about how your front desk runs give a first view of where demand is being lost; a call goes through it; the revenue assessment reads your own data. Under two minutes.',
  alternates: { canonical: '/calculator' },
};

/**
 * Rendered per request so the booking link is read at runtime.
 *
 * Statically prerendered, `NEXT_PUBLIC_BOOKING_URL` would be baked in at build
 * time and setting the Cal.com link would mean a redeploy. `/contact` is
 * dynamic for exactly this reason.
 */
export const dynamic = 'force-dynamic';

/**
 * The assessment questionnaire.
 *
 * A lead magnet, and the shape of the funnel is deliberate: the questions
 * produce an estimate, the estimate is built into an assessment, and the
 * assessment is gone through on a call. The revenue figure is never shown on
 * screen — it is the reason for the call, and a reader who already has it has
 * no reason to turn up.
 *
 * The page is server-rendered apart from the questionnaire itself, so a reader
 * with a blocked bundle still gets the first question, the explanation of what
 * this is, and a working route to the assessment.
 */
export default function CalculatorPage() {
  const booking = bookingUrl();

  return (
    <>
      {/* The sequence, drawn rather than described. People arrive here from a
          cold email promising a detailed revenue assessment and land on a
          questionnaire; without the three steps in front of them, the first
          thought is that the two do not match. */}
      <PageHeader
        label={CALCULATOR.label}
        meta={CALCULATOR.meta}
        title={CALCULATOR.title}
        emphasis={CALCULATOR.emphasis}
        lead={CALCULATOR.lead}
        feature={<Journey />}
      />

      <section
        className="surface--paper on-light section calculator-section"
        aria-labelledby="calc-title"
      >
        <div className="shell">
          <h2 className="gl-sr" id="calc-title">
            The questions
          </h2>
          <div className="calc-layout">
            <Reveal variant="card">
              <Calculator bookingUrl={booking} />
            </Reveal>

            <Reveal className="calc-aside" index={1}>
              <p className="label" style={{ marginBottom: 14 }}>
                What this is
              </p>
              <ul className="ticks">
                <li>
                  Nine questions about how your front desk runs. No system details, no logins, and
                  nothing connects to your practice management system.
                </li>
                <li>
                  A first view, modelled from what you tell us, which we go through with you on a
                  call — the figure, the working, and which of the four modules applies where.
                </li>
                <li>
                  It is not a measurement. The revenue assessment that follows the call is the one
                  that reads your own data, and we say so on the call as plainly as we say it here.
                </li>
                <li>
                  No client, patient or clinical information is collected, and none of it is needed.
                </li>
              </ul>
              <p className="small" style={{ marginTop: 28 }}>
                The paid revenue assessment is the step after the call, and it is what measures this
                properly: it reads a defined window of your own contact and scheduling data and
                reports what was actually lost, priced from your own fee schedule.
              </p>
              <p style={{ marginTop: 20 }}>
                <TextLink href="/platform#value-stages">How value is measured, in full</TextLink>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="surface--white on-light section" aria-labelledby="calc-call-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow="The call"
              aside="Thirty minutes · nothing to prepare"
              id="calc-call-title"
              title="We show our working,"
              emphasis="which nobody else does."
            />
          </Reveal>
          <div className="two-col">
            <Reveal>
              <p className="lead" style={{ marginBottom: 28 }}>
                Every coefficient behind your figure is stated on the call, with what it was set
                from. A number you can audit is worth more than a number you cannot, even when the
                auditable one is smaller — and ours is deliberately the smaller one.
              </p>
              <p className="small">
                The model is tuned to be beaten. It holds its headline at sixty per cent of what its
                own arithmetic produces and rounds every figure down, because the estimate exists to
                be exceeded by the measurement that follows rather than defended.
              </p>
            </Reveal>
            <Reveal index={1}>
              <p className="label" style={{ marginBottom: 14 }}>
                What we go through
              </p>
              <ul className="ticks">
                <li>The figure, at four separate stages rather than as one number.</li>
                <li>Your nine answers, so you can correct anything that is wrong.</li>
                <li>
                  One section per module: the leak in your practice, what it is worth, and the
                  inputs that produced it.
                </li>
                <li>What an assessment measures, what it needs, and how long it takes.</li>
                <li>Every coefficient used, and a plain statement of what the estimate is not.</li>
              </ul>
              <div style={{ marginTop: 32, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <ActionLink href="/contact">Request an assessment</ActionLink>
                <ActionLink href="/modules" variant="ghost">
                  The four modules in full
                </ActionLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
