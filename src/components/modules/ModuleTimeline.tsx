import Link from 'next/link';
import type { CSSProperties } from 'react';
import { MODULES_PAGE } from '@/content/pages';

/**
 * The signature device for the modules index.
 *
 * One horizontal axis — the life of a single opportunity — with the four
 * modules drawn as overlapping spans across it. The overlaps are the point:
 * they are where one module hands to the next, and they are why the four are
 * one system rather than four products.
 *
 * Server-rendered. Each span is a link, so the hover state is a real
 * affordance and keyboard users get the same emphasis from `:focus-visible`.
 * The spans carry increasing purple density, matching the value-stage ramp
 * used everywhere else on the site.
 */
export function ModuleTimeline() {
  const { stages, spans } = MODULES_PAGE.timeline;

  return (
    <div className="mtl">
      <ol className="mtl__axis">
        {stages.map((stage, i) => (
          <li className="mtl__stage" key={stage.key} style={{ '--i': i } as CSSProperties}>
            <span className="mtl__tick" aria-hidden="true" />
            <span className="mtl__stagekey">{stage.key}</span>
            <span className="mtl__stagedetail">{stage.detail}</span>
          </li>
        ))}
      </ol>

      <div className="mtl__spans">
        {spans.map((span, i) => (
          <Link
            className="mtl__span"
            key={span.slug}
            href={`/modules/${span.slug}`}
            style={
              {
                '--from': `${span.from}%`,
                '--width': `${span.to - span.from}%`,
                '--row': i,
                '--tone': `var(--stage-${i + 1})`,
                '--i': i,
              } as CSSProperties
            }
          >
            <span className="mtl__spanbar" aria-hidden="true" />
            <span className="mtl__spanname">{span.name}</span>
            <span className="mtl__spancaption">{span.caption}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
