import type { CSSProperties } from 'react';
import { Reveal, RevealLines } from '@/components/motion/Reveal';
import { TextLink } from '@/components/primitives';
import { StageIcon } from './StageIcon';
import { PLACEHOLDER_NOTE, RESULTS } from '@/content/proof';

/**
 * Results.
 *
 * Shows the frame a verified outcome arrives in rather than inventing one. The
 * figures are deliberately absent — each card carries a dash where a number
 * will sit, so the section is honest at a glance and needs no rebuild when real
 * figures are approved.
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
          <p className="sec-head__aside">Reporting frame</p>
        </div>

        <Reveal as="p" className="lead" variant="rise" style={{ marginBottom: 40 }}>
          {RESULTS.lead}
        </Reveal>

        <div className="results">
          {RESULTS.cards.map((card, i) => (
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
                <span className="placeholder-tag">TBC</span>
              </div>

              {/* 03 — the metric. A reserved slot rather than a stray dash: it
                  reads as a figure that has not been supplied, not as a broken
                  element. */}
              <p className="result__figure">
                <span className="result__slot" aria-hidden="true" />
                <span className="gl-sr">{`${card.stage} value, to be confirmed`}</span>
              </p>

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

        <Reveal className="results__note" variant="rise">
          <span className="placeholder-tag">Placeholder</span>
          <p className="small" style={{ flex: '1 1 22rem', margin: 0 }}>
            {RESULTS.note} {PLACEHOLDER_NOTE}
          </p>
          <TextLink href="/platform#value-stages">How a stage is promoted</TextLink>
        </Reveal>
      </div>
    </section>
  );
}
