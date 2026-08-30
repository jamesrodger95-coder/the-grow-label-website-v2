import type { CSSProperties } from 'react';
import { VALUE_STAGES } from '@/content/site';

/**
 * Multi-location comparison ledger — the veterinary page's signature device.
 *
 * One ruled row per site. Each row carries four small tracks, one per value
 * stage, filled to that stage's own percentage of the same scale — so a site's
 * decline reads left to right, and any single stage can be compared down the
 * column. Proportions are illustrative of how much sites in one group vary on
 * identical definitions; no client figures appear on this website.
 */

type Site = { name: string; stages: [number, number, number, number] };

const SITES: Site[] = [
  { name: 'Site A', stages: [100, 78, 68, 62] },
  { name: 'Site B', stages: [100, 71, 55, 49] },
  { name: 'Site C', stages: [100, 84, 76, 71] },
  { name: 'Site D', stages: [100, 62, 47, 41] },
  { name: 'Site E', stages: [100, 75, 66, 58] },
];

export function SiteComparison() {
  return (
    <div>
      <div className="sites__row sites__row--head">
        <span className="label">Practice</span>
        <span className="sites__bar" aria-hidden="true">
          {VALUE_STAGES.map((stage) => (
            <span className="label" key={stage.id}>
              {stage.name.slice(0, 3)}
            </span>
          ))}
        </span>
        <span className="label" style={{ textAlign: 'right' }}>
          Drop-off
        </span>
      </div>

      <ul className="sites">
        {SITES.map((site) => {
          const collected = site.stages[3];
          return (
            <li className="sites__row" key={site.name}>
              <span className="lrow__key">{site.name}</span>
              <span className="sites__bar">
                {site.stages.map((value, i) => (
                  <span className="sites__track" key={VALUE_STAGES[i]?.id ?? i}>
                    <span className="gl-sr">{`${VALUE_STAGES[i]?.name}: ${value} of 100`}</span>
                    <span
                      className="sites__fill"
                      aria-hidden="true"
                      style={
                        { width: `${value}%`, background: `var(--stage-${i + 1})` } as CSSProperties
                      }
                    />
                  </span>
                ))}
              </span>
              <span className="mono sites__spread">{`${100 - collected} pts`}</span>
            </li>
          );
        })}
      </ul>

      <p className="micro" style={{ marginTop: 16, maxWidth: '46ch' }}>
        Each track is one value stage on the same scale, so the drop from estimated to collected
        reads across, and a single stage reads down. Illustrative of the spread a group can carry on
        identical definitions — not client figures and not a benchmark.
      </p>
    </div>
  );
}
