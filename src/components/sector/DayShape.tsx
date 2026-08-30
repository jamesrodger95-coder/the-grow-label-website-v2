import type { CSSProperties } from 'react';

/**
 * Veterinary: the shape of a working day.
 *
 * Fourteen hours of inbound contact against the hours the desk is actually
 * staffed for. Contact that lands outside those hours is drawn in the accent,
 * because that is the demand nobody is in a position to answer.
 *
 * The heights are an illustration of a shape, not a measurement — no volume,
 * percentage or benchmark is stated anywhere.
 *
 * Server-rendered. The bars grow on a CSS stagger once motion is enabled, and
 * render at full height with motion off, so the shape is legible either way.
 */
const HOURS = [
  { label: '07', height: 34, covered: false },
  { label: '08', height: 62, covered: false },
  { label: '09', height: 88, covered: true },
  { label: '10', height: 72, covered: true },
  { label: '11', height: 54, covered: true },
  { label: '12', height: 66, covered: false },
  { label: '13', height: 78, covered: false },
  { label: '14', height: 58, covered: true },
  { label: '15', height: 64, covered: true },
  { label: '16', height: 76, covered: true },
  { label: '17', height: 92, covered: true },
  { label: '18', height: 84, covered: false },
  { label: '19', height: 68, covered: false },
  { label: '20', height: 46, covered: false },
];

export function DayShape() {
  return (
    <figure className="day">
      <div className="day__head">
        <span className="day__key">
          <span className="day__swatch day__swatch--covered" aria-hidden="true" />
          Desk staffed
        </span>
        <span className="day__key">
          <span className="day__swatch day__swatch--open" aria-hidden="true" />
          Nobody free to answer
        </span>
      </div>

      <div
        className="day__plot"
        role="img"
        aria-label="Inbound contact across a working day, with peaks before opening, during theatre and after closing, where the desk is not staffed"
      >
        {HOURS.map((hour, i) => (
          <span
            className="day__col"
            key={hour.label}
            data-covered={hour.covered ? 'true' : 'false'}
            style={{ '--h': `${hour.height}%`, '--i': i } as CSSProperties}
          >
            <span className="day__bar" />
            <span className="day__hour">{hour.label}</span>
          </span>
        ))}
      </div>
    </figure>
  );
}
