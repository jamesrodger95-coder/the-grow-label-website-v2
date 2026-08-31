/**
 * The four value-stage icons.
 *
 * Drawn rather than borrowed, in the vocabulary the rest of the site already
 * uses: rounded record cards, slot tracks, ledger rules, a hairline stroke,
 * and a dashed outline wherever something is not yet evidenced. Every glyph
 * sits on a 24 unit grid with a 1.5 stroke, which is the same optical weight
 * as the plot strokes on the module scenes at their rendered size.
 *
 * Each one depicts its own stage rather than illustrating "data" four times:
 *
 *   Estimated  a fee schedule, and a value projected off it that is still
 *              dashed, because nothing has happened yet
 *   Booked     a diary with one slot taken, against a marked time
 *   Attended   the record itself, with a status written into it
 *   Collected  a ledger, with an amount and the double rule under a total
 *
 * The four compositions are deliberately unalike — a pair, a column, a card,
 * a ruled page — so the set reads as four different facts rather than one
 * shape in four colours. No chart, no clock, no tick.
 *
 * `data-fill` marks the element carrying the stage colour. It is the only part
 * that animates: it grows from its leading edge, which is the site's DRAW verb
 * and the same motion the stage bars underneath already use. Reinforcing the
 * staircase with a motion the page already speaks beats inventing a fifth one.
 */

export type StageName = 'Estimated' | 'Booked' | 'Attended' | 'Collected';

function Estimated() {
  return (
    <>
      {/* The published fee schedule */}
      <rect x="3" y="3.5" width="9.5" height="17" rx="2" />
      <line x1="5.6" y1="8" x2="9.9" y2="8" opacity="0.5" />
      <line x1="5.6" y1="12" x2="9.9" y2="12" opacity="0.5" />
      <line x1="5.6" y1="16" x2="8.4" y2="16" opacity="0.5" />
      {/* Projected across into a value that has not happened yet */}
      <line x1="13.4" y1="12" x2="15.8" y2="12" opacity="0.5" />
      <rect x="16.4" y="8.5" width="4.6" height="7" rx="1.5" strokeDasharray="2 1.8" />
    </>
  );
}

function Booked() {
  return (
    <>
      {/* Times down the left, with one of them marked */}
      <line x1="3" y1="6" x2="4.2" y2="6" opacity="0.5" />
      <line x1="3" y1="12" x2="4.8" y2="12" />
      <line x1="3" y1="18" x2="4.2" y2="18" opacity="0.5" />
      {/* The diary, with one slot taken */}
      <rect x="6.6" y="4" width="14.4" height="4" rx="1.5" opacity="0.5" />
      <rect
        data-fill
        x="6.6"
        y="10"
        width="14.4"
        height="4"
        rx="1.5"
        stroke="none"
        fill="currentColor"
      />
      <rect x="6.6" y="16" width="14.4" height="4" rx="1.5" opacity="0.5" />
    </>
  );
}

function Attended() {
  return (
    <>
      {/* The record */}
      <rect x="3" y="3.5" width="18" height="17" rx="2" />
      <line x1="6.2" y1="8.4" x2="13.4" y2="8.4" opacity="0.5" />
      <line x1="6.2" y1="11.8" x2="10.8" y2="11.8" opacity="0.5" />
      {/* The status flag, and the status written onto the record */}
      <rect x="15.8" y="6.6" width="3.4" height="3.4" rx="1" stroke="none" fill="currentColor" />
      <rect
        data-fill
        x="6.2"
        y="14.9"
        width="8.4"
        height="3.4"
        rx="1.2"
        stroke="none"
        fill="currentColor"
      />
    </>
  );
}

function Collected() {
  return (
    <>
      {/* Ledger rules */}
      <line x1="3" y1="4.6" x2="21" y2="4.6" opacity="0.5" />
      <line x1="3" y1="8.6" x2="21" y2="8.6" opacity="0.5" />
      <line x1="3" y1="12.6" x2="21" y2="12.6" opacity="0.5" />
      {/* The amount, and the double rule a ledger draws under a total */}
      <rect
        data-fill
        x="11"
        y="14.7"
        width="10"
        height="3.8"
        rx="1.2"
        stroke="none"
        fill="currentColor"
      />
      <line x1="11" y1="20.2" x2="21" y2="20.2" />
      <line x1="11" y1="21.8" x2="21" y2="21.8" />
    </>
  );
}

const GLYPHS: Record<StageName, () => React.JSX.Element> = {
  Estimated,
  Booked,
  Attended,
  Collected,
};

export function StageIcon({ stage }: { stage: StageName }) {
  const Glyph = GLYPHS[stage];
  return (
    <svg
      className="stageicon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <Glyph />
    </svg>
  );
}
