import type { CSSProperties } from 'react';
import { DETECTION } from '@/content/home';

/**
 * WHAT IT READS TO DO THAT.
 *
 * This replaces a four-up card grid. The content is a list of inputs the
 * system reads continuously, and a card grid says "four features" rather than
 * "four streams", which is the wrong noun: the point of the section is that
 * reading is a continuous act against systems the practice already runs.
 *
 * So it is drawn as four lanes feeding one record. Each lane carries a tape of
 * marks running toward the right, and they converge on a single column that is
 * the opportunity. That is the site's consolidation verb, which the value
 * stages and the module scenes already use, applied to the one place on the
 * homepage where ingestion is the subject.
 *
 * A server component, like `RecoveryPipeline`. The travel is CSS, driven by
 * `animation-delay` off each mark's index, so there is no JavaScript, no state
 * and no client bundle cost. With scripts blocked the lanes still render
 * complete and labelled; under reduced motion the marks hold still and the
 * diagram reads as a static schematic, which is all it ever needed to be.
 *
 * The fourth lane is deliberately shorter and paler. Prices are read to
 * estimate a value, not streamed as events, and drawing all four identically
 * would have implied a symmetry that does not exist.
 */

/** Marks per lane. The fee schedule is a reference, not a feed. */
const LANE_MARKS = [7, 7, 6, 3];

export function ReadsIngest() {
  return (
    <div className="ingest">
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
              <div className="lane__tape" aria-hidden="true">
                <span className="lane__rule" />
                {Array.from({ length: LANE_MARKS[i] ?? 6 }, (_, m) => (
                  <span
                    className={`lane__mark${i === 3 ? ' lane__mark--ref' : ''}`}
                    key={m}
                    style={{ '--m': m } as CSSProperties}
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>

        {/* Where the four lanes arrive. Not a fifth input: the thing the
            other four are read in order to produce. */}
        <div className="ingest__out" aria-hidden="true">
          <span className="ingest__brace" />
          <div className="ingest__record">
            <span className="ingest__recordlabel">One tracked opportunity</span>
            <span className="ingest__recordrow" />
            <span className="ingest__recordrow ingest__recordrow--short" />
            <span className="ingest__recordrow ingest__recordrow--short" />
          </div>
        </div>
      </div>

      <p className="ingest__foot micro">{DETECTION.boundary}</p>
    </div>
  );
}
