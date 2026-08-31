import type { CSSProperties } from 'react';
import type { ModuleSlug } from '@/content/modules';

/**
 * Card-sized previews of the four module scenes.
 *
 * Each one is a reduction of the drawing on that module's own page, not a
 * generic decoration: the same geometry, the same encoding, fewer marks. The
 * card promises what the page delivers, which is the only reason to put a
 * moving thing on a card at all.
 *
 * Server components. The loop is a CSS animation on `opacity` or `transform`
 * with an `animation-delay` off each mark's index, so there is no JavaScript
 * and no client bundle cost for four previews on one page. Every preview is
 * authored in its settled state, so a blocked bundle leaves four correct
 * little diagrams, and `prefers-reduced-motion` stops the loop where it is
 * rather than hiding anything.
 *
 * The loops are long and shallow on purpose. Four cards animating in a viewport
 * is already at the limit of what reads as calm; anything faster than the
 * ambient duration would turn the grid into a slot machine.
 */

/** ANSWER: a fortnight of call volume, with the overflow caught. */
function AnswerPreview() {
  const cols = [
    [3, 2],
    [3, 2],
    [2, 0],
    [2, 0],
    [1, 0],
  ];
  return (
    <svg className="mprev" viewBox="0 0 200 44" aria-hidden="true" focusable="false">
      {cols.map(([kept, over], d) => (
        <g key={d}>
          {Array.from({ length: kept ?? 0 }, (_, n) => (
            <rect
              className="mprev__tick"
              key={n}
              x={8 + d * 38}
              y={8 + n * 10}
              width={14}
              height={6}
              rx={1}
            />
          ))}
          {Array.from({ length: over ?? 0 }, (_, n) => (
            <rect
              className="mprev__tick mprev__tick--caught"
              key={`o${n}`}
              x={25 + d * 38}
              y={8 + n * 10}
              width={14}
              height={6}
              rx={1}
              style={{ '--n': d * 2 + n } as CSSProperties}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

/** RESPOND: the decay, and the window it is worked inside. */
function RespondPreview() {
  const bars = Array.from({ length: 14 }, (_, m) => ({
    m,
    h: Math.max(2.5, (1 / (1 + m / 1.15)) * 30),
  }));
  return (
    <svg className="mprev" viewBox="0 0 200 44" aria-hidden="true" focusable="false">
      <rect className="mprev__window" x="5" y="4" width="42" height="32" rx="2" />
      {bars.map((b) => (
        <rect
          className={`mprev__bar${b.m < 3 ? ' mprev__bar--window' : ''}`}
          key={b.m}
          x={8 + b.m * 13.6}
          y={36 - b.h}
          width={9}
          height={b.h}
          rx={1}
          style={{ '--n': b.m } as CSSProperties}
        />
      ))}
      <line className="mprev__base" x1="5" y1="37" x2="195" y2="37" />
    </svg>
  );
}

/** RETAIN: a day of slots, one of them refilled. */
function RetainPreview() {
  const rows = [0, 1, 2, 3, 4, 5];
  const held = [1, 4];
  const refilled = 3;
  return (
    <svg className="mprev" viewBox="0 0 200 44" aria-hidden="true" focusable="false">
      {rows.map((r) => (
        <g key={r}>
          <rect className="mprev__slot" x="6" y={5 + r * 6.4} width={140} height={4.4} rx={1.2} />
          {held.includes(r) ? (
            <rect className="mprev__held" x="6" y={5 + r * 6.4} width={140} height={4.4} rx={1.2} />
          ) : null}
          {r === refilled ? (
            <rect
              className="mprev__held mprev__held--refill"
              x="6"
              y={5 + r * 6.4}
              width={140}
              height={4.4}
              rx={1.2}
            />
          ) : null}
        </g>
      ))}
      {/* The waiting list the refill comes from. */}
      <rect className="mprev__wait" x="158" y="5" width="34" height="4.4" rx={1.2} />
      <rect className="mprev__wait" x="158" y="11.4" width="34" height="4.4" rx={1.2} />
    </svg>
  );
}

/** REACTIVATE: the back book growing, and the curve falling across it. */
function ReactivatePreview() {
  const segs = [
    { n: 2, p: 0.8 },
    { n: 3, p: 0.56 },
    { n: 4, p: 0.36 },
    { n: 5, p: 0.2 },
    { n: 6, p: 0.09 },
  ];
  const cx = (i: number) => 20 + i * 39;
  return (
    <svg className="mprev" viewBox="0 0 200 44" aria-hidden="true" focusable="false">
      <polyline
        className="mprev__curve"
        points={segs.map((s, i) => `${cx(i)},${6 + (1 - s.p) * 24}`).join(' ')}
      />
      {segs.map((s, i) => (
        <g key={i}>
          {Array.from({ length: s.n }, (_, n) => (
            <rect
              className="mprev__rec"
              key={n}
              x={cx(i) - 7}
              y={38 - n * 5.2}
              width={14}
              height={4}
              rx={1}
            />
          ))}
          {/* The ones that come back, in proportion to the curve. */}
          {Array.from({ length: Math.max(0, Math.round(s.n * s.p)) }, (_, n) => (
            <rect
              className="mprev__rec mprev__rec--back"
              key={`b${n}`}
              x={cx(i) - 7}
              /* Off the TOP of each pile, as in the full scene: a returned
                 record leaves the stack, it does not sit under it. */
              y={38 - (s.n - 1 - n) * 5.2}
              width={14}
              height={4}
              rx={1}
              style={{ '--n': i * 2 + n } as CSSProperties}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

const PREVIEWS: Record<ModuleSlug, () => React.JSX.Element> = {
  answer: AnswerPreview,
  respond: RespondPreview,
  retain: RetainPreview,
  reactivate: ReactivatePreview,
};

export function ModulePreview({ slug }: { slug: ModuleSlug }) {
  const Preview = PREVIEWS[slug];
  return (
    <span className="modcard__preview" data-module={slug}>
      <Preview />
    </span>
  );
}
