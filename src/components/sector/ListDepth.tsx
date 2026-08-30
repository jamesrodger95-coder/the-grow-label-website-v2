import type { CSSProperties } from 'react';

/**
 * Dental: the list, and where working it stopped.
 *
 * A recall and unscheduled-treatment list drawn as rows. A divider marks how
 * far down the practice got before the day ran out; everything beneath it is
 * demand the practice already owns and did not reach.
 *
 * Illustrative of a shape only. No depth figure, adherence rate or value is
 * stated, because none has been measured.
 *
 * The divider is a row in the flow rather than an absolutely positioned line.
 * Positioning it would mean hard-coding a row height and animating `top`, and
 * it would sit on top of the row above it at any size the guess was wrong.
 */
const WORKED = [
  'Hygiene recall · 6 month',
  'Hygiene recall · 6 month',
  'Accepted plan · unscheduled',
  'Hygiene recall · 9 month',
  'Hygiene recall · 6 month',
];

const UNREACHED = [
  'Accepted plan · unscheduled',
  'Hygiene recall · 12 month',
  'Lapsed plan · no date set',
  'Accepted plan · unscheduled',
  'Hygiene recall · overdue',
  'Lapsed plan · no date set',
  'Hygiene recall · overdue',
];

export function ListDepth() {
  return (
    <figure className="depth">
      <div className="depth__head">
        <span className="depth__title">Recall and unscheduled list</span>
        <span className="depth__meta">Worked top-down</span>
      </div>

      <div
        className="depth__rows"
        role="img"
        aria-label="A recall and unscheduled treatment list worked from the top, stopping partway down, with the remainder never reached"
      >
        <ul className="depth__group">
          {WORKED.map((label, i) => (
            <li className="depth__row" key={`${label}-${i}`} data-worked="true">
              <span className="depth__mark" aria-hidden="true" />
              <span className="depth__label">{label}</span>
              <span className="depth__state">Contacted</span>
            </li>
          ))}
        </ul>

        <p className="depth__line">
          <span className="depth__linelabel">The day ran out here</span>
        </p>

        <ul className="depth__group">
          {UNREACHED.map((label, i) => (
            <li
              className="depth__row"
              key={`${label}-${i}`}
              data-worked="false"
              style={{ '--i': i } as CSSProperties}
            >
              <span className="depth__mark" aria-hidden="true" />
              <span className="depth__label">{label}</span>
              <span className="depth__state">Not reached</span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
