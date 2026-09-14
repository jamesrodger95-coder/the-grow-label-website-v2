import type { CSSProperties } from 'react';
import { PLATFORM } from '@/content/pages';

/**
 * THE PASS — the platform page opening device.
 *
 * One quantum of demand, drawn four times, in the four forms the system puts
 * it through. A raw event field becomes tracked opportunity rows, becomes work
 * held under a ceiling, becomes four stages of value. A pulse runs the rail
 * above and lights each stage as it reaches it, so the four are read in the
 * order the platform actually runs them.
 *
 * This replaces a four-item key/value strip — "Reads", "Produces", "Acts
 * through", "Reports at", each with one line of text. The strip was accurate
 * and inert. The whole argument of this page is that a figure can be opened
 * back into the event that caused it, which is a claim about a TRANSFORMATION,
 * and four boxes of prose is the one form that cannot show one.
 *
 * The relay on the modules page is its sibling and deliberately not its twin.
 * The relay shows four places on a timeline: four stations, one rail, an
 * opportunity passing through. This shows one thing changing form four times,
 * so each panel redraws the same quantity rather than moving along it.
 *
 * ---------------------------------------------------------------------------
 * HOW IT MOVES
 * ---------------------------------------------------------------------------
 * A server component. Every beat is a CSS animation whose delay comes from the
 * stage's own index and the one looping duration, so there is no JavaScript, no
 * state and no client bundle cost for the largest thing on the page.
 *
 * Everything is authored in its FINAL state — all four stages lit, every mark
 * at full strength, the rail drawn full width — and the loop applies only under
 * `[data-motion="on"]`. A blocked bundle leaves four complete, readable
 * diagrams rather than four empty frames waiting for a pulse.
 *
 * The copy is `PLATFORM.strip`, unchanged and still the only place those four
 * words and their four lines are written down.
 */

/** Which diagram belongs to which strip entry, in the order the strip is written. */
const ART = ['events', 'opportunities', 'work', 'stages'] as const;

/* -------------------------------------------------------------------------- */
/* 01 · Reads — the event field                                               */
/* -------------------------------------------------------------------------- */

/**
 * Four channel lanes of raw events. The accented marks are the ones that
 * represent lost demand; the rest are events the practice already handled.
 * Irregular spacing is the point — a real day does not arrive on a grid.
 */
const LANES: { marks: number[]; lost: number[] }[] = [
  { marks: [10, 26, 41, 58, 79, 96, 118, 137, 160, 182, 203], lost: [3, 7, 10] },
  { marks: [16, 38, 62, 90, 121, 148, 175, 200], lost: [2, 5] },
  { marks: [12, 33, 55, 72, 99, 126, 151, 178, 199], lost: [4, 8] },
  { marks: [22, 58, 96, 134, 171, 205], lost: [1, 4] },
];

function EventField() {
  return (
    <svg className="pass__svg" viewBox="0 0 220 84" aria-hidden="true" focusable="false">
      {LANES.map((lane, l) => {
        const y = 12 + l * 20;
        return (
          <g key={l}>
            <line className="pass__lane" x1={4} y1={y + 3} x2={216} y2={y + 3} />
            {lane.marks.map((x, n) => {
              const lost = lane.lost.includes(n);
              return (
                <rect
                  className={lost ? 'pass__mark pass__mark--lost' : 'pass__mark'}
                  key={n}
                  x={x}
                  y={y}
                  width={6}
                  height={6}
                  rx={1.5}
                  style={lost ? ({ '--n': lane.lost.indexOf(n) + l } as CSSProperties) : undefined}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 02 · Produces — the opportunity rows                                       */
/* -------------------------------------------------------------------------- */

/**
 * The same demand, now ordered. Each row is one tracked opportunity and carries
 * the three things that make it one: an owner, a due time and a value. The
 * three widths differ per row because opportunities are not identical, and a
 * diagram of five identical rows says the system is filing, not working.
 */
const ROWS: { owner: number; due: number; value: number }[] = [
  { owner: 30, due: 52, value: 74 },
  { owner: 24, due: 38, value: 58 },
  { owner: 30, due: 64, value: 46 },
  { owner: 20, due: 30, value: 88 },
  { owner: 26, due: 46, value: 62 },
];

function OpportunityRows() {
  return (
    <svg className="pass__svg" viewBox="0 0 220 84" aria-hidden="true" focusable="false">
      {ROWS.map((row, r) => {
        const y = 8 + r * 15;
        const dueX = 12 + row.owner + 5;
        const valueX = dueX + row.due + 5;
        return (
          <g key={r} style={{ '--n': r } as CSSProperties}>
            <circle className="pass__dot" cx={5} cy={y + 4} r={2.5} />
            <rect className="pass__owner" x={12} y={y} width={row.owner} height={8} rx={2} />
            <rect className="pass__due" x={dueX} y={y} width={row.due} height={8} rx={2} />
            <rect className="pass__value" x={valueX} y={y} width={row.value} height={8} rx={2} />
          </g>
        );
      })}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 03 · Acts through — four lanes under one ceiling                           */
/* -------------------------------------------------------------------------- */

/**
 * Four module lanes and the line none of them crosses. The ceiling is the whole
 * point of this panel: the client sets it, and the bars are drawn short of it
 * rather than pressed against it, because a bar touching its limit reads as a
 * system running flat out.
 *
 * Each lane is a well running the full height from just under the ceiling to
 * the floor, with the bar drawn inside it. The grey showing above each bar is
 * therefore the headroom the client has left, which is the one quantity this
 * panel exists to show — a well that stopped partway down would have made that
 * gap mean nothing.
 */
const WORK = [
  { top: 34, module: 'answer' },
  { top: 26, module: 'respond' },
  { top: 44, module: 'retain' },
  { top: 31, module: 'reactivate' },
];
const CEILING = 18;
const FLOOR = 77;

function WorkLanes() {
  return (
    <svg className="pass__svg" viewBox="0 0 220 84" aria-hidden="true" focusable="false">
      <line className="pass__ceiling" x1={4} y1={CEILING} x2={216} y2={CEILING} />
      {WORK.map((lane, w) => {
        const x = 14 + w * 50;
        const top = CEILING + 4;
        return (
          <g key={lane.module} style={{ '--n': w } as CSSProperties}>
            <rect className="pass__lanewell" x={x} y={top} width={38} height={FLOOR - top} rx={3} />
            <rect
              className="pass__work"
              x={x}
              y={lane.top}
              width={38}
              height={FLOOR - lane.top}
              rx={3}
            />
          </g>
        );
      })}
      <line className="pass__floor" x1={4} y1={FLOOR} x2={216} y2={FLOOR} />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 04 · Reports at — the four value stages                                    */
/* -------------------------------------------------------------------------- */

/**
 * Estimated, booked, attended, collected — the one figure the rest of this
 * site refuses to collapse, drawn as the four separate widths it actually is.
 * The tones are the stage ramp, so the four bars here mean the same thing as
 * the four bars in the reporting section further down the page.
 */
const STAGES = [208, 154, 126, 104];

function StageBars() {
  return (
    <svg className="pass__svg" viewBox="0 0 220 84" aria-hidden="true" focusable="false">
      {STAGES.map((width, s) => (
        <g key={s} style={{ '--n': s } as CSSProperties}>
          <rect className="pass__track" x={4} y={10 + s * 18} width={208} height={10} rx={5} />
          <rect
            className="pass__stagebar"
            data-stage={s + 1}
            x={4}
            y={10 + s * 18}
            width={width}
            height={10}
            rx={5}
          />
        </g>
      ))}
    </svg>
  );
}

const DIAGRAMS: Record<(typeof ART)[number], () => React.JSX.Element> = {
  events: EventField,
  opportunities: OpportunityRows,
  work: WorkLanes,
  stages: StageBars,
};

export function PlatformHero() {
  return (
    <div className="pass">
      {/* The rail. One line, with a pulse that runs its length once per loop
          and appears to light each stage as it arrives. */}
      <div className="pass__rail" aria-hidden="true">
        <span className="pass__line" />
        <span className="pass__pulse" />
      </div>

      <ol className="pass__stages">
        {PLATFORM.strip.map((item, i) => {
          const Art = DIAGRAMS[ART[i] ?? 'events'];
          return (
            <li className="pass__stage" key={item.key} style={{ '--s': i } as CSSProperties}>
              <span className="pass__node" aria-hidden="true">
                <span className="pass__nodedot" />
              </span>

              <div className="pass__panel">
                <p className="pass__head">
                  <span className="pass__idx">{`0${i + 1}`}</span>
                  <span className="pass__key">{item.key}</span>
                </p>

                <span className="pass__art">
                  <Art />
                </span>

                <p className="pass__detail">{item.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
