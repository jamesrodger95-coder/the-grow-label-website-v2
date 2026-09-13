import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Faq } from '@/components/layout/Faq';
import { Reveal } from '@/components/motion/Reveal';
import { AssessmentForm } from '@/components/contact/AssessmentForm';
import { ActionLink, SectionHeader, StepList, TextLink } from '@/components/primitives';
import { FAQ_GROUPS } from '@/content/faq';
import { CONTACT } from '@/content/pages';
import { bookingUrl, deliveryMode } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Request an assessment',
  description:
    'Request a revenue-recovery assessment. We read a defined window of your own operational data and return a written view of where demand is being lost.',
  alternates: { canonical: '/contact' },
};

export const dynamic = 'force-dynamic';

export default function ContactPage() {
  const configured = deliveryMode() !== 'unconfigured';
  const booking = bookingUrl();

  return (
    <>
      <PageHeader
        label={CONTACT.label}
        meta="Four steps · no obligation"
        title={CONTACT.title}
        emphasis={CONTACT.emphasis}
        lead={CONTACT.lead}
      />

      <section className="surface--paper on-light section" aria-labelledby="journey-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow="What happens next"
              id="journey-title"
              title="Four steps, stated"
              emphasis="before the form."
            />
          </Reveal>

          <div className="two-col">
            <Reveal>
              <StepList items={CONTACT.steps} headingLevel={3} />
              <div style={{ marginTop: 36 }}>
                <p className="label" style={{ marginBottom: 14 }}>
                  Before you write
                </p>
                <ul className="ticks">
                  <li>
                    Nothing is installed and nothing is changed in your systems to produce an
                    assessment.
                  </li>
                  <li>You keep the written analysis whether or not you go further.</li>
                  <li>
                    No client, patient or clinical information should be sent through this form.
                  </li>
                </ul>
              </div>
              {booking ? (
                <p style={{ marginTop: 28 }}>
                  <a className="tlink" href={booking} rel="noopener noreferrer" target="_blank">
                    Book the scoping call directly <span aria-hidden="true">&rarr;</span>
                  </a>
                </p>
              ) : null}
            </Reveal>

            <Reveal index={1}>
              <h3 className="display d4" style={{ marginBottom: 24 }}>
                Send the outline
              </h3>
              <AssessmentForm configured={configured} dataNotice={CONTACT.dataNotice} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="surface--black on-dark section" aria-labelledby="scope-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow="Scope"
              id="scope-title"
              title="What an assessment"
              emphasis="does and does not cover."
            />
          </Reveal>
          <div className="two-col--even two-col">
            <Reveal>
              <p className="label label--accent" style={{ marginBottom: 18 }}>
                In scope
              </p>
              <ul className="ticks">
                <li>A defined historical window of contact and scheduling data.</li>
                <li>
                  Where demand was lost, by channel, by site and by hour, using your own
                  definitions.
                </li>
                <li>Estimated value of what was lost, priced from your own fee schedule.</li>
                <li>Which modules would address which part of it, and what each would need.</li>
                <li>A plain statement of what the data cannot tell us.</li>
              </ul>
            </Reveal>
            <Reveal index={1}>
              <p className="label" style={{ marginBottom: 18 }}>
                Not in scope
              </p>
              <ul className="ticks">
                <li>Any forecast of booked, attended or collected value. Those need live data.</li>
                <li>Any benchmark or comparison against other practices.</li>
                <li>Any clinical review, audit or recommendation.</li>
                <li>Any change to your systems, schedule or contact policy.</li>
              </ul>
              <p className="small" style={{ marginTop: 28, maxWidth: '48ch' }}>
                An assessment is a measurement exercise. It is deliberately not a pilot, and it does
                not commit either side to anything.
              </p>
              <p style={{ marginTop: 24 }}>
                <TextLink href="/platform#value-stages">
                  How the four value stages are defined
                </TextLink>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The questions that actually get asked before a first call. --------- */}
      <section className="surface--paper on-light section" aria-labelledby="faq-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow="Questions"
              aside="Price · terms · data · boundaries"
              id="faq-title"
              title="The questions people ask"
              emphasis="before the first call."
            />
          </Reveal>
          <Reveal as="p" className="lead" style={{ maxWidth: '62ch', marginBottom: 48 }}>
            Including the two that are usually avoided until a proposal arrives: what it costs, and
            what happens if it does not work.
          </Reveal>
          <Faq groups={FAQ_GROUPS} />
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
