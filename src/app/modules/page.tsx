import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { ModuleTimeline } from '@/components/modules/ModuleTimeline';
import { ModulePreview } from '@/components/modules/ModulePreview';
import { Reveal } from '@/components/motion/Reveal';
import {
  ActionLink,
  KeyValueStrip,
  PullStatement,
  SectionHeader,
  TextLink,
} from '@/components/primitives';
import { MODULES } from '@/content/modules';
import { MODULES_PAGE } from '@/content/pages';
import { CTA } from '@/content/site';

export const metadata: Metadata = {
  title: 'Modules',
  description:
    'Answer, Respond, Retain and Reactivate: four modules covering first contact, first response, booked capacity and dormant records, all reporting into the same four value stages.',
  alternates: { canonical: '/modules' },
};

export default function ModulesPage() {
  return (
    <>
      <PageHeader
        label={MODULES_PAGE.label}
        title={MODULES_PAGE.title}
        emphasis={MODULES_PAGE.emphasis}
        lead={MODULES_PAGE.lead}
        strip={MODULES_PAGE.strip}
      />

      {/* The organising device: one opportunity, four places it drops. ----- */}
      <section className="surface--paper on-light section" aria-labelledby="timeline-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow={MODULES_PAGE.timeline.eyebrow}
              id="timeline-title"
              title={MODULES_PAGE.timeline.title}
              emphasis={MODULES_PAGE.timeline.emphasis}
            />
          </Reveal>
          <Reveal as="p" className="lead" style={{ maxWidth: '64ch', marginBottom: 48 }}>
            {MODULES_PAGE.timeline.lead}
          </Reveal>
          <Reveal variant="card">
            <ModuleTimeline />
          </Reveal>
          <Reveal as="p" className="micro" style={{ marginTop: 28, color: 'var(--faint)' }}>
            The spans overlap deliberately. A contact that goes unanswered at nine in the evening is
            an Answer event and a Respond event, and it is counted once.
          </Reveal>
        </div>
      </section>

      {/* The four, in full. --------------------------------------------- */}
      <section className="surface--white on-light section" aria-labelledby="four-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow="The four"
              aside="Answer · Respond · Retain · Reactivate"
              id="four-title"
              title="What each one watches,"
              emphasis="and what it is allowed to do."
            />
          </Reveal>

          {/* Four cards, one identity each.

              The variation is tone and weight inside the one purple, not four
              hues picked at random: Answer is the lightest because it is the
              earliest and least certain point in the system, Reactivate the
              deepest. That is the same ramp the value stages use, so the cards
              inherit a meaning the reader has already been taught rather than
              carrying a decoration.

              The whole card is the link. A nested link inside a clickable card
              gives keyboard users two stops for one destination and screen
              readers an ambiguous one, so the anchor wraps everything and the
              focus ring is drawn on the card. */}
          <div className="modcards">
            {MODULES.map((mod, i) => {
              const moves = mod.stages
                .filter((stage) => stage.role === 'Influences')
                .map((stage) => stage.stage);
              const movesLabel =
                moves.length > 1
                  ? `${moves.slice(0, -1).join(', ')} and ${moves[moves.length - 1]}`
                  : (moves[0] ?? '');
              return (
                <Reveal
                  key={mod.slug}
                  variant="card"
                  index={i}
                  style={{ '--i': i } as CSSProperties}
                >
                  <Link className="modcard" href={`/modules/${mod.slug}`} data-module={mod.slug}>
                    <ModulePreview slug={mod.slug} />

                    <span className="modcard__head">
                      <span className="modcard__index">{`0${mod.index}`}</span>
                      <span className="modcard__name">{mod.name}</span>
                    </span>

                    {/* The one-line job it does. */}
                    <span className="modcard__job">{mod.summary}</span>

                    {/* The metric it moves. Which of the four value stages this
                        module can actually influence, as opposed to observe. */}
                    <span className="modcard__metric">
                      <span className="modcard__metriclabel">Moves</span>
                      <span className="modcard__metricvalue">{movesLabel}</span>
                    </span>

                    {/* Revealed on hover and on focus. Supplementary rather than
                        essential, because there is no hover on a phone, where
                        it is shown outright instead. */}
                    <span className="modcard__reveal">{mod.position}</span>

                    <span className="modcard__link">
                      {`How ${mod.name} works`}
                      <span aria-hidden="true">&nbsp;&rarr;</span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* The ceiling. --------------------------------------------------- */}
      <section className="surface--ink on-dark section" aria-labelledby="ceiling-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow={MODULES_PAGE.boundary.eyebrow}
              id="ceiling-title"
              title={MODULES_PAGE.boundary.title}
              emphasis={MODULES_PAGE.boundary.emphasis}
            />
          </Reveal>
          <Reveal as="p" className="lead" style={{ maxWidth: '62ch', marginBottom: 44 }}>
            {MODULES_PAGE.boundary.lead}
          </Reveal>
          <Reveal>
            <KeyValueStrip items={MODULES_PAGE.boundary.items} />
          </Reveal>
          <Reveal style={{ marginTop: 'var(--gl-s-8)' }}>
            <PullStatement
              label="The one that is not negotiable"
              title="No module makes a clinical judgement."
              emphasis="Not once, not in any form."
              body="Grow Label reads scheduling and contact data. It does not triage, assess, advise or diagnose, and anything that sounds urgent goes straight to the practice’s own emergency route."
            />
          </Reveal>
        </div>
      </section>

      {/* Where to start. ------------------------------------------------ */}
      <section className="ctaband surface--black on-dark" aria-labelledby="modules-cta">
        <div className="shell">
          <div className="ctaband__inner">
            <Reveal>
              <p className="label label--accent" style={{ marginBottom: 24 }}>
                Where to start
              </p>
              <h2 className="display d2" id="modules-cta" style={{ marginBottom: 28 }}>
                {MODULES_PAGE.close.title} <em>{MODULES_PAGE.close.emphasis}</em>
              </h2>
              <p className="body" style={{ maxWidth: '54ch' }}>
                {MODULES_PAGE.close.body}
              </p>
              <div style={{ marginTop: 36, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <ActionLink href={CTA.primary.href}>{CTA.primary.longLabel}</ActionLink>
                <ActionLink href="/platform" variant="ghost">
                  How the system fits together
                </ActionLink>
              </div>
              <p style={{ marginTop: 28 }}>
                <TextLink href="/platform#value-stages">How value is measured</TextLink>
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
