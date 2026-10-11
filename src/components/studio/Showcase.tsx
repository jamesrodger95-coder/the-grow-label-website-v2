'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { useScene } from '@/components/modules/scene/useScene';
import { STUDIO_BAND, STUDIO_SHOWCASE } from '@/content/studio';
import type { WorkItem } from '@/lib/studio-media';
import { LoopVideo } from './WorkGallery';

/**
 * Whatever you sell: the work, in every format, in one collage.
 *
 * As the section scrolls in, the pieces fly out of a stack at the centre of
 * the stage, turning and growing into a layered spread: a widescreen film in
 * the middle, reels in phone frames down the sides, feed posts tucked between.
 * Settled, each piece floats a little at its own depth. Scroll position is
 * read at paint time by the shared scene ticker; only transform is written.
 *
 * The finished collage is what the server renders, so scripts blocked or
 * reduced motion leave the spread in place and still.
 */

type Piece = (typeof STUDIO_SHOWCASE.pieces)[number];

const eased = (v: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, v)), 3);

function ratioOf(item: WorkItem): number {
  const [w, h] = item.ratio.split(':').map(Number);
  return (w ?? 1) / (h ?? 1);
}

function settled(piece: Piece): string {
  return `translate(-50%, -50%) rotate(${piece.r}deg)`;
}

export function Showcase({ items }: { items: WorkItem[] }) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cards = useRef<{ el: HTMLElement; piece: Piece; dx: number; dy: number; i: number }[]>([]);

  const pieces = STUDIO_SHOWCASE.pieces
    .map((piece) => ({ piece, item: items.find((w) => w.id === piece.id && w.src) }))
    .filter((p): p is { piece: Piece; item: WorkItem } => Boolean(p.item));

  const host = useScene<HTMLDivElement>(
    (p, t) => {
      for (const { el, piece, dx, dy, i } of cards.current) {
        if (el.offsetParent === null) continue;
        // Front pieces arrive a little later than the back ones.
        const e = eased((p - piece.depth * 0.12) / 0.7);
        const from = 1 - e;
        const spin = (i % 2 ? 1 : -1) * (8 + i * 1.5);
        const float = e * Math.sin(t * 0.7 + i * 1.3) * (3 + piece.depth * 6);
        el.style.transform =
          `translate(-50%, -50%) translate3d(${(dx * from).toFixed(1)}px, ${(dy * from + float).toFixed(1)}px, 0) ` +
          `rotate(${(piece.r * e + spin * from).toFixed(2)}deg) scale(${(0.5 + 0.5 * e).toFixed(3)})`;
      }
    },
    { ambient: true, from: 1, to: 0.3 }
  );

  // Measure each card's distance from the stage centre, at rest.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      cards.current = Array.from(stage.querySelectorAll<HTMLElement>('.show__card')).map(
        (el, i) => ({
          el,
          i,
          piece: pieces[i]!.piece,
          // `left` and `top` are the card's centre; transforms do not move them.
          dx: w / 2 - el.offsetLeft,
          dy: h / 2 - el.offsetTop,
        })
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
    // The pieces are fixed for the life of the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="show" id="industries" aria-labelledby="show-title">
      <div className="studio-shell show__head">
        <p className="studio-eyebrow">{STUDIO_SHOWCASE.eyebrow}</p>
        <h2 className="studio-display" id="show-title">
          {STUDIO_SHOWCASE.title}
          <br />
          <em>{STUDIO_SHOWCASE.emphasis}</em>
        </h2>
        <div className="show__aside">
          <p className="show__for">
            <span>{STUDIO_SHOWCASE.forLabel}</span>
            <span className="show__rotor" aria-hidden="true">
              {STUDIO_BAND.map((label, i) => (
                <span key={label} style={{ '--i': i, '--n': STUDIO_BAND.length } as CSSProperties}>
                  {label}
                </span>
              ))}
            </span>
            <span className="gl-sr">{STUDIO_BAND.join(', ')}</span>
          </p>
          <p className="show__lead">{STUDIO_SHOWCASE.lead}</p>
        </div>
      </div>

      <div ref={host}>
        <div className="show__stage" ref={stageRef} role="img" aria-label={STUDIO_SHOWCASE.label}>
          {pieces.map(({ piece, item }, i) => (
            <div
              key={piece.id}
              className="show__card"
              data-shape={item.ratio}
              data-mobile={piece.m ? 'true' : 'false'}
              style={
                {
                  '--x': piece.x,
                  '--y': piece.y,
                  '--w': piece.w,
                  '--mx': piece.m?.x ?? piece.x,
                  '--my': piece.m?.y ?? piece.y,
                  '--mw': piece.m?.w ?? piece.w,
                  '--ratio': ratioOf(item),
                  '--z': Math.round(piece.depth * 10) + (i === 0 ? 20 : 0),
                  transform: settled(piece),
                } as CSSProperties
              }
            >
              <LoopVideo src={item.src!} poster={item.poster} />
              <span className="show__tag">{`${piece.tag} · ${item.ratio}`}</span>
            </div>
          ))}
        </div>
      </div>

      <ul className="studio-shell show__legend">
        {STUDIO_SHOWCASE.legend.map((entry) => (
          <li key={entry.ratio}>
            <span
              className="show__glyph"
              style={{ '--ratio': entry.ratio.replace(':', ' / ') } as CSSProperties}
              aria-hidden="true"
            />
            <span className="show__legendratio">{entry.ratio}</span>
            {entry.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
