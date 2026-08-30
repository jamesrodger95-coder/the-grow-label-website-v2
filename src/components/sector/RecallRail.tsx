import type { CSSProperties } from 'react';

/**
 * Recall interval rail — the dental page's signature device.
 *
 * Each row is an interval track. Ticks are records sitting at a point relative
 * to their due date; the shaded zone is the window in which the list is
 * actually being worked. Where the shading stops is where the revenue stops.
 * Positions are illustrative only.
 */

type Row = {
  label: string;
  /** Percentage along the track where the due date falls. */
  due: number;
  /** Percentage at which the list stops being worked. */
  worked: number;
  ticks: number[];
};

const ROWS: Row[] = [
  { label: 'Six-month recall', due: 44, worked: 62, ticks: [8, 17, 26, 33, 41, 48, 56, 67, 78, 88] },
  { label: 'Nine-month recall', due: 44, worked: 48, ticks: [11, 22, 30, 39, 46, 58, 69, 81, 91] },
  { label: 'Twelve-month recall', due: 44, worked: 34, ticks: [9, 19, 28, 37, 45, 54, 63, 74, 84, 93] },
  { label: 'Accepted, unscheduled', due: 22, worked: 26, ticks: [6, 14, 24, 35, 44, 52, 61, 72, 83, 94] },
];

export function RecallRail() {
  return (
    <div>
      <div className="rail__row" style={{ borderBottom: '1px solid var(--rule)' }}>
        <span className="label">Interval type</span>
        <span className="label">Due date · then how far the list is worked</span>
      </div>
      <div className="rail">
        {ROWS.map((row) => (
          <div className="rail__row" key={row.label}>
            <span className="lrow__key" style={{ fontSize: 'var(--gl-t-small)' }}>
              {row.label}
            </span>
            <span className="rail__track" aria-hidden="true">
              <span
                className="rail__zone"
                style={{ left: 0, width: `${row.worked}%` } as CSSProperties}
              />
              <span className="rail__due" style={{ left: `${row.due}%` } as CSSProperties} />
              {row.ticks.map((t) => (
                <span
                  className="rail__tick"
                  key={t}
                  style={{ left: `${t}%`, '--o': t <= row.worked ? 1 : 0.28 } as CSSProperties}
                />
              ))}
            </span>
          </div>
        ))}
      </div>
      <p className="micro" style={{ marginTop: 16, maxWidth: '48ch' }}>
        Solid ticks are records the list reached. Faded ticks are records past the point where
        working the list stopped. Illustrative of the shape of the problem, not client data.
      </p>
    </div>
  );
}
