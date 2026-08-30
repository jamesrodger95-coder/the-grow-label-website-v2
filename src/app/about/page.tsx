import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/motion/Reveal';
import {
  ActionLink,
  KeyValueStrip,
  PullStatement,
  SectionHeader,
  StepList,
  TextLink,
} from '@/components/primitives';
import { ABOUT } from '@/content/pages';
import { CTA } from '@/content/site';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Grow Label works on demand a practice has already generated. That decision determines what we measure, what we refuse to claim, and why the reporting is built to be argued with.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        label={ABOUT.label}
        meta="Position · principles · audience"
        title={ABOUT.title}
        emphasis={ABOUT.emphasis}
        lead={ABOUT.lead}
        strip={[
          { key: 'What we work on', detail: 'Demand your practice already generated' },
          { key: 'What we report', detail: 'Four value stages, never one blended figure' },
          { key: 'What we never do', detail: 'Clinical triage, advice or assessment' },
          { key: 'Who sets the limits', detail: 'The practice, at configuration and afterwards' },
        ]}
      />

      {/* § 01 — Position ------------------------------------------------- */}
      <section className="surface--paper on-light section" aria-labelledby="position-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num={ABOUT.position.num}
              aside={ABOUT.position.aside}
              id="position-title"
              title={ABOUT.position.title}
              emphasis={ABOUT.position.emphasis}
            />
          </Reveal>
          <div className="two-col">
            <Reveal>
              {ABOUT.position.body.map((paragraph) => (
                <p className="body" key={paragraph.slice(0, 24)}>
                  {paragraph}
                </p>
              ))}
            </Reveal>
            <Reveal index={1}>
              <PullStatement
                label="In one line"
                title="Make unglamorous work"
                emphasis="continuous, bounded and measurable."
                body="That is the whole product. Everything else on this site is an elaboration of it."
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* § 02 — Operating principles -------------------------------------- */}
      <section className="surface--ink on-dark section" aria-labelledby="principles-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num={ABOUT.principles.num}
              aside={ABOUT.principles.aside}
              id="principles-title"
              title={ABOUT.principles.title}
              emphasis={ABOUT.principles.emphasis}
            />
          </Reveal>
          <Reveal>
            <StepList items={ABOUT.principles.items} />
          </Reveal>
          <Reveal as="p" className="small" style={{ marginTop: 32, maxWidth: '58ch' }}>
            These are constraints, not values. Each one rules out a feature that would be easier to
            sell.
          </Reveal>
        </div>
      </section>

      {/* § 03 — Who this is for ------------------------------------------- */}
      <section className="surface--paper on-light section" aria-labelledby="who-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num={ABOUT.who.num}
              aside={ABOUT.who.aside}
              id="who-title"
              title={ABOUT.who.title}
              emphasis={ABOUT.who.emphasis}
            />
          </Reveal>
          <Reveal as="p" className="lead" style={{ marginBottom: 44 }}>
            {ABOUT.who.lead}
          </Reveal>
          <Reveal>
            <KeyValueStrip items={ABOUT.who.audiences} />
          </Reveal>
          <Reveal style={{ marginTop: 56, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <ActionLink href={CTA.primary.href}>{CTA.primary.longLabel}</ActionLink>
            <ActionLink href="/methodology" variant="ghost">
              Read the methodology first
            </ActionLink>
          </Reveal>
          <Reveal as="p" style={{ marginTop: 28 }}>
            <TextLink href="/insights">Notes on revenue operations</TextLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
