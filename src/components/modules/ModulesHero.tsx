import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ModulePreview } from './ModulePreview';
import { MODULES } from '@/content/modules';

/**
 * THE RELAY — the modules page opening device.
 *
 * One opportunity runs left to right along a rail, and the four modules are
 * the stations it passes through. A pulse travels the rail on the ambient
 * loop; as it reaches each station that station's node fills, its rule draws
 * and its panel warms, so the four light in the order an opportunity actually
 * meets them. Then it starts again.
 *
 * This replaces a four-item key/value strip — the module names and one line
 * each, set as text. The strip was accurate and said nothing: four modules
 * covering four points in a sequence is a shape, and a list is the one form
 * that cannot show a shape.
 *
 * Each station carries the reduced scene from that module's own page, so the
 * opening promises exactly what the four cards further down the page deliver.
 *
 * ---------------------------------------------------------------------------
 * HOW IT MOVES
 * ---------------------------------------------------------------------------
 * A server component. Every beat is a CSS animation with a delay derived from
 * the station's own index, so there is no JavaScript, no state and no client
 * bundle cost for the largest thing on the page.
 *
 * Everything is authored in its FINAL state — all four stations lit, the rail
 * drawn full width — and the loop is applied only under `[data-motion="on"]`.
 * A blocked bundle therefore leaves four complete, readable stations rather
 * than four empty outlines waiting for a pulse that never arrives.
 *
 * One curve, one duration. The whole relay runs on `--gl-dur-ambient`, which
 * is the only duration on this site allowed to loop, and each station's delay
 * is that duration divided by four rather than a number typed in.
 */

/** The leak each module covers. The reason it exists, in five words. */
const COVERS: Record<string, string> = {
  answer: 'Contact that is never picked up',
  respond: 'Enquiries answered after the window closes',
  retain: 'Booked capacity that empties again',
  reactivate: 'Records that stopped coming back',
};

/** Where in the life of an opportunity each module sits. */
const WHEN: Record<string, string> = {
  answer: 'Before a record exists',
  respond: 'Minutes to hours',
  retain: 'Booked to attended',
  reactivate: 'Months later',
};

export function ModulesHero() {
  return (
    <div className="relay">
      {/* The rail. One line, drawn from the leading edge, with a pulse that
          runs its length once per loop. */}
      <div className="relay__rail" aria-hidden="true">
        <span className="relay__line" />
        <span className="relay__pulse" />
      </div>

      <ol className="relay__stations">
        {MODULES.map((mod, i) => (
          <li className="station" key={mod.slug} style={{ '--s': i } as CSSProperties}>
            {/* The node on the rail. Sits above the panel and is what the
                pulse appears to light as it passes. */}
            <span className="station__node" aria-hidden="true">
              <span className="station__nodedot" />
            </span>

            <Link className="station__panel" href={`/modules/${mod.slug}`} data-module={mod.slug}>
              <span className="station__when">{WHEN[mod.slug]}</span>

              <span className="station__head">
                <span className="station__idx">{`0${mod.index}`}</span>
                <span className="station__name">{mod.name}</span>
              </span>

              <span className="station__art" aria-hidden="true">
                <ModulePreview slug={mod.slug} />
              </span>

              <span className="station__covers">{COVERS[mod.slug]}</span>

              <span className="station__go">
                {`How ${mod.name} works`}
                <span aria-hidden="true">&nbsp;&rarr;</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
