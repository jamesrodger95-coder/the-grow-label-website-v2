import type { CSSProperties } from 'react';
import { TIME_RETURNED } from '@/content/home';

/**
 * THE SECOND RETURN — which recurring jobs stop landing on the desk.
 *
 * The section claims that a list of recurring manual jobs stops landing on the
 * same four people. That is a claim about who does what, so the drawing is a
 * board with two owners and five jobs that have moved across it.
 *
 * ---------------------------------------------------------------------------
 * WHAT CHANGED
 * ---------------------------------------------------------------------------
 * The previous version drew two column headings and then put every chip in the
 * right-hand column with a dotted leader behind it. Nothing crossed anything:
 * the left column was empty, so the handover the section is about was implied
 * by a dotted line and a heading rather than drawn. It read as a list of pills
 * that happened to be indented.
 *
 * Now each row starts with a ghost of the job where it used to sit, and the
 * track carries an arrowhead across the centre rule into the chip. Same idiom
 * as the hero panel — a ghost is where something was, purple is where it is —
 * so the two signature visuals on the page speak the same language.
 *
 * It deliberately does NOT draw hours saved. Hours saved would be a results
 * claim, and this site does not make those; who performs a recurring job is a
 * description of designed behaviour, which is what the rest of the page is
 * made of. The last row says that exceptions come back, because a board on
 * which everything moves one way would describe a product that does not exist.
 *
 * Server-rendered and CSS-only. Each job's slide is a transform with a delay
 * off its index, gated on `data-motion` so the authored markup — every job
 * already across — is what a blocked bundle leaves behind.
 *
 * ---------------------------------------------------------------------------
 * THE LINE, AND THE CHIP
 * ---------------------------------------------------------------------------
 * The chip a job ends up in is now a filled purple pill rather than a purple
 * outline on a 50-tint. The board's whole point is that the right-hand column
 * is where the work now sits; a tinted outline said "proposed", and the solid
 * fill says "there".
 *
 * Underneath each row is a track. It draws purple left to right on the same
 * per-row delay as the chip, so the line carries the job across rather than
 * the job teleporting over a static rule, and then a slow pulse repeats the
 * trip. That pulse is the only loop on this panel and it is ambient, so the
 * section observer pauses it the moment the board leaves the viewport.
 */
export function DeskBoard() {
  return (
    <div className="board">
      <div className="board__head">
        <span className="board__title">Where the recurring work sits</span>
        <span className="board__count">{TIME_RETURNED.items.length} jobs</span>
      </div>

      <div className="board__cols" aria-hidden="true">
        <span className="board__col board__col--from">Front desk</span>
        <span className="board__col board__col--to">Grow Label</span>
      </div>

      <ul className="board__jobs">
        {TIME_RETURNED.items.map((item, i) => (
          <li className="job" key={item.index} style={{ '--i': i } as CSSProperties}>
            {/* The line the job travels along. It runs the full width of the
                row underneath everything else, draws purple left to right as
                the chip arrives, and then carries a slow pulse along the same
                path so the board reads as a route rather than as a snapshot.
                The track is the clip; the pulse is its pseudo-element. */}
            <span className="job__track" aria-hidden="true" />
            <span className="job__idx" aria-hidden="true">
              {item.index}
            </span>
            {/* Where it used to sit. A ghost, not a label: repeating the job
                name on both sides of the board would double the reading for
                no extra information. */}
            <span className="job__ghost" aria-hidden="true" />
            {/* The chip travels inside a cell that is exactly one column wide,
                so `translateX(-100%)` is one column for every row. Animating
                the chip itself moved each one by its own width, which sent the
                longest label furthest and straight out of the panel. */}
            <span className="job__cell">
              <span className="job__chip">
                <span className="job__name">{item.title}</span>
              </span>
            </span>
          </li>
        ))}
      </ul>

      <p className="board__back">
        <span className="board__backarrow" aria-hidden="true">
          &larr;
        </span>
        Anything that meets an escalation trigger comes straight back to a person, with the context
        already attached.
      </p>
    </div>
  );
}
