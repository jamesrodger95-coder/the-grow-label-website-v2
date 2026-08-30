import type { CSSProperties } from 'react';

/**
 * Multi-location comparison ledger — the veterinary page's signature device.
 *
 * One ruled row per site, each showing the same four value stages so the
 * comparison is like-for-like. The proportions are illustrative of the shape of
 * a group's variation, not data: no client figures appear on this website.
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
      <div className="sites__row" style={{ borderBottom: '1px solid var(--rule)' }}>
        <span className="label">Practice</span>
        <span className="label">Estimated → booked → attended → collected</span>
        <span className="label" style={{ textAlign: 'right' }}>
          Spread
        </span>
      </div>
      <div className="sites">
        {SITES.map((site) => {
          const collected = site.stages[3];
          return (
            <div className="sites__row" key={site.name}>
              <span className="lrow__key">{site.name}</span>
              <span className="sites__bar" aria-hidden="true">
                {site.stages.map((value, i) => (
                  <span
                    className="sites__seg"
                    key={i}
                    style={
                      {
                        background: `var(--stage-${i + 1})`,
                        transform: `scaleY(${(0.45 + (value / 100) * 0.55).toFixed(2)})`,
                      } as CSSProperties
                    }
                  />
                ))}
              </span>
              <span className="mono" style={{ fontSize: 'var(--gl-t-small)', textAlign: 'right' }}>
                {`${100 - collected} pts`}
              </span>
            </div>
          );
        })}
      </div>
      <p className="micro" style={{ marginTop: 16, maxWidth: '46ch' }}>
        Illustrative of how much sites in one group can differ on identical definitions. These are
        not client figures and not a benchmark.
      </p>
    </div>
  );
}
