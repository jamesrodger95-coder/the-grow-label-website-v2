import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/motion/Reveal';
import { ActionLink, StepList, TextLink } from '@/components/primitives';
import { BOOKED } from '@/content/calculator';

/**
 * Where Cal.com returns somebody once the call is booked.
 *
 * Point the event type's redirect here. It is `noindex` and out of the
 * sitemap on purpose: a confirmation page that ranks is a page people arrive
 * at without having done the thing it confirms.
 */
export const metadata: Metadata = {
  title: 'Your call is booked',
  description: 'Your revenue assessment call is confirmed.',
  alternates: { canonical: '/assessment-booked' },
  robots: { index: false, follow: false },
};

export default function AssessmentBookedPage() {
  return (
    <>
      <PageHeader
        label={BOOKED.label}
        meta="Confirmed · details in your inbox"
        title={BOOKED.title}
        emphasis={BOOKED.emphasis}
        lead={BOOKED.lead}
      />

      <section className="surface--paper on-light section" aria-labelledby="booked-steps-title">
        <div className="shell">
          <h2 className="display d2" id="booked-steps-title" style={{ marginBottom: 48 }}>
            {BOOKED.stepsTitle}
          </h2>

          {/* Even columns: the step list carries its own three-column grid and
              was being squeezed into the aside width, breaking every title
              across two lines. */}
          <div className="two-col two-col--even">
            <Reveal>
              <StepList items={BOOKED.steps} headingLevel={3} glow />
            </Reveal>

            <Reveal index={1}>
              <p className="label" style={{ marginBottom: 14 }}>
                {BOOKED.prepTitle}
              </p>
              <p className="body" style={{ marginBottom: 28 }}>
                {BOOKED.prepBody}
              </p>
              <p className="small" style={{ marginBottom: 32 }}>
                {BOOKED.reschedule}
              </p>
              <p>
                <TextLink href="/platform#value-stages">
                  How the four value stages are defined
                </TextLink>
              </p>
            </Reveal>
          </div>

          <Reveal
            style={{ marginTop: 'var(--gl-s-8)', display: 'flex', gap: 14, flexWrap: 'wrap' }}
          >
            <ActionLink href="/platform">How the system fits together</ActionLink>
            <ActionLink href="/modules" variant="ghost">
              The four modules in full
            </ActionLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
