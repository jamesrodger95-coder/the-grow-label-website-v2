import type { CSSProperties } from 'react';

/**
 * Recall interval rail — the dental page's signature device, also used by med spa.
 *
 * Each row is one interval type. Ticks are records positioned along the
 * interval; the shaded band is how far down the list actually gets worked.
 * Records the list reached are full-height and solid; the ones past the stop
 * point are short and faint. Where the shading ends is where the revenue ends.
 * Positions are illustrative only.
 */

type Row = {
  label: string;
  /** Percentage along the track at which the list stops being worked. */
  worked: number;
  ticks: number[];
};

const ROWS: Row[] = [
  { label: 'Six-month recall', worked: 62, ticks: [8, 17, 26, 33, 41, 48, 56, 67, 78, 88] },
  { label: 'Nine-month recall', worked: 48, ticks: [11, 22, 30, 39, 46, 58, 69, 81, 91] },
  { label: 'Twelve-month recall', worked: 34, ticks: [9, 19, 28, 37, 45, 54, 63, 74, 84, 93] },
  { label: 'Accepted, unscheduled', worked: 26, ticks: [6, 14, 24, 35, 44, 52, 61, 72, 83, 94] },
];

const MED_SPA_ROWS: Row[] = [
  { label: 'Repeat clients, due now', worked: 58, ticks: [8, 17, 26, 33, 41, 48, 56, 67, 78, 88] },
  { label: 'Series, next visit unbooked', worked: 46, ticks: [11, 22, 30, 39, 46, 58, 69, 81, 91] },
  { label: 'Memberships, lapsed', worked: 32, ticks: [9, 19, 28, 37, 45, 54, 63, 74, 84, 93] },
  {
    label: 'Consultations, no booking',
    worked: 24,
    ticks: [6, 14, 24, 35, 44, 52, 61, 72, 83, 94],
  },
];

export function RecallRail({ variant = 'dental' }: { variant?: 'dental' | 'med-spa' }) {
  const rows = variant === 'med-spa' ? MED_SPA_ROWS : ROWS;
  return (
    <div>
      <div className="rail__row rail__row--head">
        <span className="label">{variant === 'med-spa' ? 'List' : 'Interval type'}</span>
        <span className="label">How far down the list is worked</span>
        <span className="label" style={{ textAlign: 'right' }}>
          Reached
        </span>
      </div>

      <ul className="rail">
        {rows.map((row) => {
          const reached = row.ticks.filter((t) => t <= row.worked).length;
          return (
            <li className="rail__row" key={row.label}>
              <span className="lrow__key" style={{ fontSize: 'var(--gl-t-small)' }}>
                {row.label}
                <span className="gl-sr">
                  {`: worked to ${row.worked}%, reaching ${reached} of ${row.ticks.length} records`}
                </span>
              </span>
              <span className="rail__track" aria-hidden="true">
                <span className="rail__zone" style={{ width: `${row.worked}%` } as CSSProperties} />
                <span className="rail__stop" style={{ left: `${row.worked}%` } as CSSProperties} />
                {row.ticks.map((t) => (
                  <span
                    className={t <= row.worked ? 'rail__tick' : 'rail__tick rail__tick--missed'}
                    key={t}
                    style={{ left: `${t}%` } as CSSProperties}
                  />
                ))}
              </span>
              <span className="rail__count mono">{`${reached}/${row.ticks.length}`}</span>
            </li>
          );
        })}
      </ul>

      <p className="micro" style={{ marginTop: 16, maxWidth: '48ch' }}>
        Solid ticks are records the list reached. Short faint ticks are records past the point where
        working the list stopped, and the vertical rule is where that happened. Illustrative of the
        shape of the problem, not client data.
      </p>
    </div>
  );
}
