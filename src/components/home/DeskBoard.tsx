import type { CSSProperties } from 'react';
import { TIME_RETURNED } from '@/content/home';

/**
 * THE SECOND RETURN — which recurring jobs stop landing on the desk.
 *
 * The section claims that a list of recurring manual jobs stops landing on the
 * same four people. That is a claim about who does what, so the drawing is a
 * board with two owners and five jobs that move across it.
 *
 * It deliberately does NOT draw hours saved. Hours saved would be a results
 * claim, and this site does not make those; who performs a recurring job is a
 * description of designed behaviour, which is what the rest of the page is
 * made of. The last row of the board says that exceptions come back, because
 * a board on which everything moves one way would be describing a product
 * that does not exist.
 *
 * Server-rendered, CSS-only, like `RecoveryPipeline` and `ReadsIngest`. Each
 * job's slide is a transform with a delay off its index; reduced motion
 * leaves every job already in its settled column, which is the state the
 * markup is authored in.
 */
export function DeskBoard() {
  return (
    <div className="board">
      <div className="board__head">
        <span className="board__col board__col--from">Front desk</span>
        <span className="board__col board__col--to">Grow Label</span>
      </div>

      <ul className="board__jobs">
        {TIME_RETURNED.items.map((item, i) => (
          <li className="job" key={item.index} style={{ '--i': i } as CSSProperties}>
            <span className="job__idx" aria-hidden="true">
              {item.index}
            </span>
            <span className="job__track" aria-hidden="true" />
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
