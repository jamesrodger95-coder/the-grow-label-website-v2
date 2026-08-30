import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/motion/Reveal';
import { ActionLink, SectionHeader, StageBar, StepList, TextLink } from '@/components/primitives';
import { CANNOT_CLAIM, METHOD_HEAD, STAGE_DEFINITIONS, TERMS } from '@/content/methodology';
import { CTA } from '@/content/site';

export const metadata: Metadata = {
  title: 'Measurement methodology',
  description:
    'How Grow Label defines estimated, booked, attended and collected value, what promotes a figure between stages, and what this measurement cannot tell you.',
  alternates: { canonical: '/methodology' },
};

const STAGE_ROWS = [
  { name: 'Estimated', width: 100, figure: 'Modelled' },
  { name: 'Booked', width: 74, figure: 'PMS record' },
  { name: 'Attended', width: 62, figure: 'PMS record' },
  { name: 'Collected', width: 55, figure: 'Ledger' },
];

export default function MethodologyPage() {
  return (
    <>
      <PageHeader
        label={METHOD_HEAD.label}
        meta="Four stages · six definitions · five limits"
        title={METHOD_HEAD.title}
        emphasis={METHOD_HEAD.emphasis}
        lead={METHOD_HEAD.lead}
        strip={METHOD_HEAD.strip}
      />

      {/* § 01 — The four stages ----------------------------------------- */}
      <section className="surface--bone on-light section" aria-labelledby="stages-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num="§ 01 / 04"
              aside="Value stages"
              id="stages-title"
              title="Four stages, four levels"
              emphasis="of certainty."
            />
          </Reveal>

          <div className="two-col" style={{ marginBottom: 64 }}>
            <Reveal>
              <p className="body" style={{ marginBottom: 20 }}>
                A figure only moves to the next stage when a system record says it has. Nothing is
                promoted on inference, and nothing is promoted because a reasonable person would
                assume it happened.
              </p>
              <p className="body">
                The three gaps between the four stages are where the operational conversation is.
                Estimated to booked is a conversion question. Booked to attended is a confirmation
                question. Attended to collected is a billing question — and that one is not a
                recovery problem at all.
              </p>
            </Reveal>
            <Reveal index={1}>
              <StageBar
                rows={STAGE_ROWS}
                labelledBy="stages-title"
                caption="Illustrative of the shape of the staircase. No benchmark, industry average or client figure appears anywhere on this site."
              />
            </Reveal>
          </div>

          <div className="defs">
            {STAGE_DEFINITIONS.map((stage, i) => (
              <Reveal className="def" key={stage.index} index={i}>
                <div>
                  <h3 className="def__term">{stage.name}</h3>
                  <p className="label def__meta">{`Confidence · ${stage.confidence}`}</p>
                  <p className="label" style={{ marginTop: 8 }}>
                    {`Promoted by · ${stage.promotedBy}`}
                  </p>
                </div>
                <div>
                  <p className="body" style={{ marginBottom: 14 }}>
                    {stage.body}
                  </p>
                  <p className="small" style={{ display: 'flex', gap: 12 }}>
                    <span className="label label--accent" style={{ flex: 'none', paddingTop: 4 }}>
                      Caution
                    </span>
                    <span>{stage.caution}</span>
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* § 02 — Definitions ---------------------------------------------- */}
      <section className="surface--ink on-dark section" aria-labelledby="terms-title">
        <div className="shell ledger-field">
          <Reveal variant="group">
            <SectionHeader
              num="§ 02 / 04"
              aside="Definitions"
              id="terms-title"
              title="The six terms that decide"
              emphasis="what a figure means."
            />
          </Reveal>
          <div className="defs">
            {TERMS.map((term, i) => (
              <Reveal className="def" key={term.term} index={i}>
                <div>
                  <h3 className="def__term">{term.term}</h3>
                  <p className="label def__meta">{term.meta}</p>
                </div>
                <p className="body">{term.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* § 03 — What we cannot claim -------------------------------------- */}
      <section className="surface--paper on-light section" aria-labelledby="limits-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num="§ 03 / 04"
              aside="Limits"
              id="limits-title"
              title={CANNOT_CLAIM.title}
              emphasis={CANNOT_CLAIM.emphasis}
            />
          </Reveal>
          <Reveal as="p" className="lead" style={{ marginBottom: 44 }}>
            {CANNOT_CLAIM.lead}
          </Reveal>
          <Reveal>
            <StepList items={CANNOT_CLAIM.items} />
          </Reveal>
          <Reveal as="p" className="small" style={{ marginTop: 32, maxWidth: '62ch' }}>
            If any of this is uncomfortable to read on a marketing site, that is the point. A
            measurement framework that only lists its strengths is a sales document wearing a lab
            coat.
          </Reveal>
        </div>
      </section>

      {/* § 04 — Questions to ask ------------------------------------------ */}
      <section className="ctaband surface--void on-dark" aria-labelledby="questions-title">
        <div className="shell">
          <div className="ctaband__inner">
            <Reveal>
              <p className="label label--accent" style={{ marginBottom: 24 }}>
                § 04 / 04 · Use this against us
              </p>
              <h2 className="display d2" id="questions-title" style={{ marginBottom: 28 }}>
                Five questions to ask <em>any provider in this category.</em>
              </h2>
              <p className="body">
                Including us. If a provider cannot answer all five without changing the subject, the
                number they are quoting is not one you can take to a board.
              </p>
              <div style={{ marginTop: 36, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <ActionLink href={CTA.primary.href}>{CTA.primary.longLabel}</ActionLink>
              </div>
              <p style={{ marginTop: 28 }}>
                <TextLink href="/insights/why-one-revenue-number-is-not-enough">
                  The long version of this argument
                </TextLink>
              </p>
            </Reveal>
            <Reveal index={1}>
              <ol className="ledger">
                {[
                  'Which of the four stages does your headline figure describe?',
                  'What promotes an item from one stage to the next — a record, or an inference?',
                  'What happens to a figure when the appointment behind it is later cancelled?',
                  'Can I open any number and see the source event that produced it?',
                  'How do you decide that two contacts are the same opportunity?',
                ].map((question, i) => (
                  <li className="lrow" key={question} style={{ gridTemplateColumns: '2.5rem 1fr' }}>
                    <span className="lrow__idx">{`0${i + 1}`}</span>
                    <span className="lrow__key" style={{ fontWeight: 400 }}>
                      {question}
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
