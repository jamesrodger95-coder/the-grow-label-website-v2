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
 * ---------------------------------------------------------------------------
 * WHAT CHANGED
 * ---------------------------------------------------------------------------
 * It was four phase headings above four stacked bars, floating on the section
 * ground with nothing joining them. Two things were missing, and they were the
 * same thing twice: there was no shared coordinate space, so a reader could
 * not tell which phase a span sat under, and the overlap the caption insists
 * on was invisible — the bars read as a staircase, which is the one shape that
 * says "these happen in turn" rather than "these happen at once".
 *
 * Now the phases and the spans are drawn on one grid inside one panel, with
 * the phase boundaries ruled full height so every span visibly crosses them.
 * A playhead sweeps the axis on the ambient loop, the same verb as the relay
 * above it, and where it crosses two spans at once the overlap is the thing
 * you are looking at rather than a claim in a footnote.
 *
 * Server-rendered, CSS-only. Each span is a link, so hover is a real
 * affordance and keyboard users get the same emphasis from `:focus-visible`.
 * The spans carry increasing purple density, matching the value-stage ramp
 * used everywhere else on the site.
 */
export function ModuleTimeline() {
  const { stages, spans } = MODULES_PAGE.timeline;

  return (
    <div className="mtl">
      {/* The phase boundaries, ruled the full height of the panel. This is the
          shared coordinate space: the spans below are positioned as
          percentages of the same axis, so a span crossing a rule is a module
          that genuinely spans two phases. */}
      <div className="mtl__rules" aria-hidden="true">
        <span style={{ '--at': '25%' } as CSSProperties} />
        <span style={{ '--at': '50%' } as CSSProperties} />
        <span style={{ '--at': '75%' } as CSSProperties} />
      </div>

      {/* The sweep. One opportunity moving through its own life; wherever it
          is, the spans it is inside are the modules currently holding it. */}
      <span className="mtl__playhead" aria-hidden="true">
        <span className="mtl__playheadglow" />
      </span>

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
            data-module={span.slug}
            style={
              {
                '--from': `${span.from}%`,
                '--width': `${span.to - span.from}%`,
                '--row': i,
                '--i': i,
              } as CSSProperties
            }
          >
            <span className="mtl__spanbar" aria-hidden="true" />
            <span className="mtl__spanhead">
              <span className="mtl__spanidx">{`0${i + 1}`}</span>
              <span className="mtl__spanname">{span.name}</span>
            </span>
            <span className="mtl__spancaption">{span.caption}</span>
            {/* The window this module covers, in the axis's own terms. Stated
                because a bar's left and right edges are a measurement, and a
                measurement with no units is decoration. */}
            <span className="mtl__spanrange" aria-hidden="true">
              {`${span.from}–${span.to}`}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
