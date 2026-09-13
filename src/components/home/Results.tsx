import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Reveal, RevealLines } from '@/components/motion/Reveal';
import { TextLink } from '@/components/primitives';
import { StageIcon } from './StageIcon';
import { RESULTS } from '@/content/proof';
import {
  ILLUSTRATIVE,
  ILLUSTRATIVE_ENGAGEMENT,
  ILLUSTRATIVE_METRICS,
  ILLUSTRATIVE_RESULTS_NOTE,
  ILLUSTRATIVE_STAGES,
} from '@/content/illustrative';

/**
 * Results.
 *
 * A worked example of the reporting frame: one engagement, four stages, and
 * the operational detail the money came from. Every figure is imported from
 * `content/illustrative.ts` and every surface that shows one carries the
 * illustrative badge, so nothing here can be mistaken for client evidence.
 */

/**
 * The icon ramp: four opaque steps of the one hue, lightest at Estimated and
 * darkest at Collected, so the mark alone says how much is known.
 */
const ICON_TONE = [
  'var(--gl-purple-400)',
  'var(--gl-purple-500)',
  'var(--gl-purple-600)',
  'var(--gl-purple-700)',
];

export function Results() {
  return (
    <section
      className="surface--paper on-light section"
      id="results"
      aria-labelledby="results-title"
    >
      <div className="shell">
        <div className="sec-head">
          <div>
            <Reveal variant="rise">
              <span className="eyebrow sec-head__eyebrow">{RESULTS.eyebrow}</span>
            </Reveal>
            <RevealLines
              as="h2"
              id="results-title"
              className="display d2"
              lines={RESULTS.titleLines.map((line, i) =>
                i === 1 ? <em key={line}>{line}</em> : line
              )}
            />
          </div>
          <p className="sec-head__aside">{RESULTS.aside}</p>
        </div>

        <Reveal as="p" className="lead" variant="rise" style={{ marginBottom: 32 }}>
          {RESULTS.lead}
        </Reveal>

        {/* The scenario the figures belong to, stated before the first one is
            read. A number without a subject and a period attached is the exact
            failure this section exists to argue against.

            The badge that used to sit at the head of this row has gone. It
            read as an unfinished placeholder rather than as a disclosure, and
            saying "illustrative" twice in one section does not make the
            section twice as honest — the basis row below carries it once,
            where a reader has the figures in front of them. */}
        <Reveal className="scenario" variant="rise">
          <dl className="scenario__facts">
            <div>
              <dt className="micro">Subject</dt>
              <dd className="label label--strong">{ILLUSTRATIVE_ENGAGEMENT.subject}</dd>
            </div>
            <div>
              <dt className="micro">Period</dt>
              <dd className="label label--strong">{ILLUSTRATIVE_ENGAGEMENT.period}</dd>
            </div>
            <div>
              <dt className="micro">Scope</dt>
              <dd className="label label--strong">{ILLUSTRATIVE_ENGAGEMENT.scope}</dd>
            </div>
          </dl>
        </Reveal>

        <div className="results">
          {ILLUSTRATIVE_STAGES.map((card, i) => (
            <Reveal
              className="result"
              key={card.stage}
              variant="card"
              index={i}
              style={{ '--i': i, '--c': card.tone, '--ico': ICON_TONE[i] } as CSSProperties}
            >
              {/* 01 — the mark. Carries the stage colour, so the four icons
                  read as one ramp before a word has been read. */}
              <span className="result__icon">
                <StageIcon stage={card.stage} />
              </span>

              {/* 02 — the label */}
              <div className="result__stage">
                <span className="label label--strong">{card.stage}</span>
                <span className="result__pct">{card.width}</span>
              </div>

              {/* 03 — the figure */}
              <p className="result__figure">{card.value}</p>

              <div className="result__bar" aria-hidden="true">
                <span
                  className="result__barfill"
                  style={{ '--w': card.width, '--c': card.tone, '--i': i } as CSSProperties}
                />
              </div>

              {/* 04 — the explanation: what promotes a figure to this stage */}
              <p className="result__basis">{card.basis}</p>
              <p className="result__hint micro">{card.hint}</p>
            </Reveal>
          ))}
        </div>

        {/* The operational detail underneath the money. Deliberately varied in
            shape — counts, medians, depths, hours — because eight identically
            framed percentages read as a template rather than as a report. */}
        <div className="metrics">
          {ILLUSTRATIVE_METRICS.map((metric, i) => (
            <Reveal className="metric" key={metric.id} variant="card" index={i % 4}>
              <p className="metric__value">{metric.value}</p>
              <p className="metric__label">{metric.label}</p>
              <p className="metric__basis micro">{metric.basis}</p>
              <Link className="metric__module" href={metric.href}>
                {metric.module}
                <span aria-hidden="true">&nbsp;&rarr;</span>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* The section's one disclosure, at the foot of the figures rather than
            at the head of them. A reader who has the numbers in front of them
            is the reader this sentence is for. */}
        <Reveal className="results__note" variant="rise">
          <span className="placeholder-tag">{ILLUSTRATIVE.tag}</span>
          <p className="micro" style={{ flex: '1 1 26rem', margin: 0 }}>
            {ILLUSTRATIVE_RESULTS_NOTE}
          </p>
          <TextLink href="/platform#value-stages">How a stage is promoted</TextLink>
        </Reveal>
      </div>
    </section>
  );
}
