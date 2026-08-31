'use client';

import { useRef } from 'react';
import { SceneFrame } from './SceneFrame';
import { seg, useScene } from './useScene';

/**
 * REACTIVATE — the back book, and what comes back out of it.
 *
 * Six columns of dormant records, segmented by how overdue they are. The
 * columns grow as the interval grows, because that is what a back book does
 * when nobody works it: the oldest segment is always the largest.
 *
 * A curve above them falls steeply from left to right. That is the chance of
 * a record returning, and it decays with the same thing the columns are
 * sorted by. Together they state the problem in one picture: the biggest pile
 * is the least likely to return, so working the list in whatever order it
 * exports in is the wrong order.
 *
 * Records then lift straight up out of their own column into the schedule
 * band at the top, in numbers set by the curve. They stay in their column
 * while they do it, which matters: the settled frame has to keep saying
 * "six came back from three months and one from two years", and a uniform row
 * of returned records at the top would have thrown that away the moment the
 * animation finished.
 *
 * Beats:
 *   0.00 - 0.28   the dormant field builds, oldest segment largest
 *   0.28 - 0.50   the probability curve draws across it
 *   0.50 - 1.00   records return, in proportion to the curve
 */

/**
 * Record counts grow with the interval; the chance of a return collapses.
 * The counts are deliberately close together rather than dramatic, so the
 * decay the reader sees in the returned band comes from the probability and
 * not from the size of the pile it was drawn from.
 */
const SEGMENTS = [
  { label: '3 mo', records: 8, p: 0.75 },
  { label: '6 mo', records: 9, p: 0.5 },
  { label: '9 mo', records: 10, p: 0.3 },
  { label: '12 mo', records: 11, p: 0.16 },
  { label: '18 mo', records: 12, p: 0.07 },
  { label: '24 mo+', records: 13, p: 0.05 },
];

const COL_X = 50;
const COL_W = 57;
const DOT = 7;
const STEP = 9; // dot plus gap
const PER_ROW = 3;
const BASE_Y = 202;
const BAND_Y = 34; // where returned records land
const CURVE_TOP = 76;
const CURVE_BOTTOM = 140;

const colX = (i: number) => COL_X + i * COL_W;
const centreX = (i: number) => colX(i) + (PER_ROW * STEP - (STEP - DOT)) / 2;

/** Dormant records stack upward from the baseline. */
const restY = (n: number) => BASE_Y - Math.floor(n / PER_ROW) * STEP - DOT;
/** Returned records stack downward from the band. */
const bandY = (k: number) => BAND_Y + Math.floor(k / PER_ROW) * STEP;

const P_MAX = SEGMENTS[0]!.p;
const P_MIN = SEGMENTS[SEGMENTS.length - 1]!.p;
const curveY = (p: number) =>
  CURVE_TOP + ((P_MAX - p) / (P_MAX - P_MIN)) * (CURVE_BOTTOM - CURVE_TOP);

type Rec = {
  id: string;
  x: number;
  y: number;
  order: number;
  returns: boolean;
  /** Destination, for the ones that come back. Same column, up in the band. */
  toX: number;
  toY: number;
};

function buildBook(): Rec[] {
  const out: Rec[] = [];
  for (let i = 0; i < SEGMENTS.length; i += 1) {
    const s = SEGMENTS[i]!;
    const returning = Math.max(0, Math.round(s.records * s.p));
    let k = 0;
    for (let n = 0; n < s.records; n += 1) {
      // Returners are taken from the top of the pile, so the column visibly
      // shortens instead of developing holes in the middle.
      const returns = n >= s.records - returning;
      out.push({
        id: `${i}-${n}`,
        x: colX(i) + (n % PER_ROW) * STEP,
        y: restY(n),
        order: i / SEGMENTS.length + (n / s.records) * 0.1,
        returns,
        toX: colX(i) + (k % PER_ROW) * STEP,
        toY: bandY(k),
      });
      if (returns) k += 1;
    }
  }
  return out;
}

const BOOK = buildBook();
const TOTAL = BOOK.length;
const RETURNING = BOOK.filter((r) => r.returns).length;

const CURVE = SEGMENTS.map((s, i) => `${centreX(i)},${curveY(s.p)}`).join(' ');

export function ReactivateScene() {
  const dotRefs = useRef<(SVGGElement | null)[]>([]);
  const curveRef = useRef<SVGGElement | null>(null);
  const readRefs = useRef<(HTMLElement | null)[]>([]);
  const cache = useRef<Float32Array>(new Float32Array(TOTAL * 2 + 6).fill(-1));

  const hostRef = useScene<HTMLDivElement>((p) => {
    const c = cache.current;
    let back = 0;

    for (let i = 0; i < BOOK.length; i += 1) {
      const r = BOOK[i]!;

      // The field builds from the oldest segment inwards, so the pile the
      // reader sees first is the one the module is arguing about.
      const appear = seg(p, 0.02 + (1 - r.order) * 0.2, 0.14 + (1 - r.order) * 0.2);
      const go = r.returns ? seg(p, 0.52 + r.order * 0.34, 0.66 + r.order * 0.34) : 0;

      const el = dotRefs.current[i];
      if (!el) continue;

      const o = r.returns ? Math.max(appear * 0.85, go) : appear * 0.85;
      const oq = Math.round(o * 100) / 100;
      if (c[i * 2] !== oq) {
        c[i * 2] = oq;
        el.style.opacity = String(oq);
      }

      if (!r.returns) continue;

      const gq = Math.round(go * 100) / 100;
      if (c[i * 2 + 1] !== gq) {
        c[i * 2 + 1] = gq;
        el.style.transform = `translate(${(r.toX - r.x) * gq}px, ${(r.toY - r.y) * gq}px)`;
      }
      if (go > 0.6) back += 1;
    }

    const cq = Math.round(seg(p, 0.28, 0.5) * 100) / 100;
    if (c[TOTAL * 2] !== cq) {
      c[TOTAL * 2] = cq;
      if (curveRef.current) curveRef.current.style.opacity = String(cq);
    }

    if (c[TOTAL * 2 + 1] !== back) {
      c[TOTAL * 2 + 1] = back;
      const el = readRefs.current[2];
      if (el) el.textContent = String(back);
    }
  });

  return (
    <div ref={hostRef}>
      <SceneFrame
        label="A dormant database, by months overdue"
        onReadout={(el, i) => {
          readRefs.current[i] = el;
        }}
        readouts={[
          { key: 'Records in the back book', value: String(TOTAL) },
          { key: 'Largest segment', value: '24 mo+' },
          { key: 'Returned to the schedule', value: String(RETURNING), tone: 'signal' },
        ]}
        note="Illustrative of the shape of a back book, not a measurement. Each square is one record. The curve is the relative chance of a record returning, which falls as the overdue interval grows, so the largest segment is also the hardest to work."
      >
        <svg
          className="mplot"
          viewBox="0 0 400 244"
          role="img"
          aria-label="A dormant database in six columns by how overdue each record is, from three months to over twenty-four. The columns grow as the interval grows, so the oldest segment is the largest. A curve above them falls steeply from left to right, showing that the chance of a record returning decays as the interval grows. Records then move up into a schedule band at the top of their own column: six return from the three-month segment and one from the segment over twenty-four months."
        >
          <text className="mplot__axis" x={COL_X} y={22}>
            Returned to the schedule
          </text>

          {/* The probability curve, over the field it describes */}
          <g ref={curveRef} style={{ opacity: 1 }}>
            <polyline className="mplot__curve" points={CURVE} />
            {SEGMENTS.map((s, i) => (
              <circle
                className="mplot__curvedot"
                key={s.label}
                cx={centreX(i)}
                cy={curveY(s.p)}
                r={2.4}
              />
            ))}
            <text
              className="mplot__axis mplot__curvelabel"
              x={centreX(0)}
              y={curveY(P_MAX) - 9}
              textAnchor="middle"
            >
              Chance of returning
            </text>
          </g>

          {/* The records */}
          {BOOK.map((r, i) => (
            <g
              key={r.id}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              style={
                r.returns
                  ? { transform: `translate(${r.toX - r.x}px, ${r.toY - r.y}px)`, opacity: 1 }
                  : { opacity: 0.85 }
              }
            >
              <rect
                className={r.returns ? 'mplot__rec mplot__rec--back' : 'mplot__rec'}
                x={r.x}
                y={r.y}
                width={DOT}
                height={DOT}
                rx={1.5}
              />
            </g>
          ))}

          {/* Segment labels */}
          {SEGMENTS.map((s, i) => (
            <text
              className="mplot__axis"
              key={s.label}
              x={centreX(i)}
              y={BASE_Y + 15}
              textAnchor="middle"
            >
              {s.label}
            </text>
          ))}
          <text
            className="mplot__axis"
            x={(centreX(0) + centreX(SEGMENTS.length - 1)) / 2}
            y={BASE_Y + 30}
            textAnchor="middle"
          >
            Months since the record was last seen
          </text>
        </svg>
      </SceneFrame>
    </div>
  );
}
