import type { CSSProperties } from 'react';
import { DETECTION } from '@/content/home';

/**
 * WHAT IT READS TO DO THAT.
 *
 * Four streams the system reads continuously, converging on the one record
 * they exist to produce. That is the site's consolidation verb, applied to the
 * one place on the homepage where ingestion is the subject.
 *
 * ---------------------------------------------------------------------------
 * WHAT WAS WRONG WITH THE PREVIOUS VERSION
 * ---------------------------------------------------------------------------
 * The lanes were 600px of empty rule carrying six small dashes, and the record
 * they fed was a 200px card floating off to one side behind a hairline brace.
 * Three quarters of the panel was air, the convergence was not drawn at all —
 * the lanes ran parallel and simply stopped — and the record, which is the
 * point of the whole diagram, was the smallest thing in it.
 *
 * What changed:
 *
 *   1. The lanes converge. Each one is a drawn path that bends toward a shared
 *      collector on the right, so the four-into-one is a shape rather than an
 *      assertion. One SVG, one viewBox, no per-lane positioning in CSS.
 *   2. The record is the terminus and is sized like it: a real card with the
 *      fields a tracked opportunity actually carries, so a reader can see what
 *      the four streams add up to.
 *   3. Each stream says what it emits — a sample event, in the shape it
 *      arrives in — which is the detail that turns four labels into four
 *      things you can picture.
 *
 * Still a server component, still CSS-only motion: the marks travel on
 * `animation-delay` off their index. With scripts blocked the diagram renders
 * complete and labelled; under reduced motion the marks hold still and it
 * reads as a static schematic, which is all it ever needed to be.
 *
 * The fourth stream is deliberately quieter. Prices are read to estimate a
 * value, not streamed as events, and drawing all four identically would imply
 * a symmetry that does not exist.
 */

/** A sample of what each stream actually emits, in the shape it arrives in. */
const SAMPLES = [
  '21:40 · web form · no reply',
  '16:20 · chair released · 45 min',
  'recall due Mar · still open',
  'fee schedule · v4',
];

/** Marks per lane. The fee schedule is a reference, not a feed. */
const LANE_MARKS = [6, 6, 5, 3];

/** Vertical centre of each lane in the connector's viewBox. */
const LANE_Y = [20, 60, 100, 140];
const HUB_Y = 80;

export function ReadsIngest() {
  return (
    <div className="ingest" data-ambient="on">
      <div className="ingest__head">
        <span className="ingest__label">What it reads to do that</span>
        <span className="ingest__note micro">Read continuously, never stored as clinical data</span>
      </div>

      <div className="ingest__body">
        <ul className="ingest__lanes">
          {DETECTION.reads.map((item, i) => (
            <li className="lane" key={item.key} style={{ '--lane': i } as CSSProperties}>
              <div className="lane__meta">
                <p className="lane__key">{item.key}</p>
                <p className="lane__detail">{item.detail}</p>
              </div>
              <div className="lane__feed">
                <span className="lane__sample">{SAMPLES[i]}</span>
                <span className="lane__tape" aria-hidden="true">
                  <span className="lane__rule" />
                  {Array.from({ length: LANE_MARKS[i] ?? 5 }, (_, m) => (
                    <span
                      className={`lane__mark${i === 3 ? ' lane__mark--ref' : ''}`}
                      key={m}
                      style={{ '--m': m } as CSSProperties}
                    />
                  ))}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* The convergence, drawn rather than implied. Four paths bend from
            their lane's centre line into one collector, which is where the
            record sits. `preserveAspectRatio="none"` lets the viewBox stretch
            to whatever width the column takes without redrawing anything. */}
        <svg
          className="ingest__join"
          viewBox="0 0 60 160"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          {LANE_Y.map((y, i) => (
            <path
              className={`ingest__joinpath${i === 3 ? ' ingest__joinpath--ref' : ''}`}
              key={y}
              d={`M0 ${y} C 28 ${y}, 32 ${HUB_Y}, 60 ${HUB_Y}`}
              style={{ '--m': i } as CSSProperties}
            />
          ))}
        </svg>

        {/* Where the four streams arrive. Not a fifth input: the thing the
            other four are read in order to produce. */}
        <div className="ingest__out">
          <div className="ingest__record">
            <span className="ingest__recordhead">
              <span className="ingest__recorddot" aria-hidden="true" />
              One tracked opportunity
            </span>
            <dl className="ingest__fields">
              <div>
                <dt>Source</dt>
                <dd>Web form, 21:40</dd>
              </div>
              <div>
                <dt>Owner</dt>
                <dd>Respond</dd>
              </div>
              <div>
                <dt>Due</dt>
                <dd>Within 15 min</dd>
              </div>
              <div>
                <dt>Estimated</dt>
                <dd>From your fee schedule</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <p className="ingest__foot micro">{DETECTION.boundary}</p>
    </div>
  );
}
