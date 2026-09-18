import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/motion/Reveal';
import { Calculator } from '@/components/calculator/Calculator';
import { ActionLink, SectionHeader, TextLink } from '@/components/primitives';
import { CALCULATOR, REPORT } from '@/content/calculator';

export const metadata: Metadata = {
  title: 'Revenue recovery calculator',
  description:
    'A conservative, modelled estimate of the revenue your practice generates and does not convert. Nine questions, under two minutes, and the figure is shown before anything is asked for.',
  alternates: { canonical: '/calculator' },
};

/**
 * The calculator.
 *
 * It sits before the paid assessment in the funnel: this estimates, the
 * assessment measures, and every line of copy on the route holds that line.
 *
 * The page is server-rendered apart from the wizard itself, so a reader with a
 * blocked bundle still gets the first question, the explanation of what the
 * model is, and a working route to the assessment.
 */
export default function CalculatorPage() {
  return (
    <>
      <PageHeader
        label={CALCULATOR.label}
        meta={CALCULATOR.meta}
        title={CALCULATOR.title}
        emphasis={CALCULATOR.emphasis}
        lead={CALCULATOR.lead}
      />

      <section className="surface--paper on-light section" aria-labelledby="calc-title">
        <div className="shell">
          <h2 className="gl-sr" id="calc-title">
            The questions
          </h2>
          <div className="calc-layout">
            <Reveal variant="card">
              <Calculator />
            </Reveal>

            <Reveal className="calc-aside" index={1}>
              <p className="label" style={{ marginBottom: 14 }}>
                What this is
              </p>
              <ul className="ticks">
                <li>
                  A modelled estimate from nine answers. It is not a measurement, and nothing in it
                  has been read from your systems.
                </li>
                <li>
                  Deliberately conservative. The headline holds at sixty per cent of what the model
                  produces, and every figure is rounded down.
                </li>
                <li>
                  The figure appears before the form. Nothing is gated behind an email except the
                  written report.
                </li>
                <li>
                  No client, patient or clinical information is collected, and none of it is needed.
                </li>
              </ul>
              <p className="small" style={{ marginTop: 28 }}>
                The paid revenue assessment is what measures this properly: it reads a defined
                window of your own contact and scheduling data and reports what was actually lost,
                priced from your own fee schedule.
              </p>
              <p style={{ marginTop: 20 }}>
                <TextLink href="/platform#value-stages">How value is measured, in full</TextLink>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="surface--white on-light section" aria-labelledby="calc-report-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow="The report"
              aside="Ten pages · every coefficient stated"
              id="calc-report-title"
              title="It shows its working,"
              emphasis="which nobody else does."
            />
          </Reveal>
          <div className="two-col">
            <Reveal>
              <p className="lead" style={{ marginBottom: 28 }}>
                {REPORT.methodologyBody[0]}
              </p>
              <p className="small">{REPORT.basisBody}</p>
            </Reveal>
            <Reveal index={1}>
              <p className="label" style={{ marginBottom: 14 }}>
                What the report contains
              </p>
              <ul className="ticks">
                <li>The estimate, and the front-desk hours a year behind it.</li>
                <li>Your nine answers, so you can correct anything that is wrong.</li>
                <li>
                  One page per module: the leak in your practice, the figure, and the inputs that
                  produced it.
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
