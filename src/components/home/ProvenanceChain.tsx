import type { CSSProperties } from 'react';
import { Reveal } from '@/components/motion/Reveal';

/**
 * EVIDENCE — the quieter variant.
 *
 * The claim is that every figure opens into the event that produced it. That
 * is a claim about a chain, so the drawing is a chain: a figure on the
 * dashboard at the top, and four links down to the record underneath it.
 *
 * This is still the QUIET version of the device rather than a second
 * instrument panel: no titled chrome bar and no readout row.
 * `RecoveryPipeline` two screens above already shows an event becoming a
 * record, and a second full panel making the same shape would cost the first
 * one its authority. What this adds is the direction the first one does not
 * show: downwards, from a number back to the thing that caused it.
 *
 * ---------------------------------------------------------------------------
 * THE FIGURE AT THE TOP
 * ---------------------------------------------------------------------------
 * It used to be a 92x30 hatched rectangle. The intent was honest — there is no
 * client data on this site, and drawing a plausible number here would be the
 * exact failure the section argues against — but it did not read as a withheld
 * figure. It read as a missing asset, a grey mesh box on the one panel whose
 * job is to look like a dashboard.
 *
 * So the value is still withheld, but it is now drawn as a figure cell:
 * a stage tag, the digits masked as glyph blocks rather than hatching, and the
 * expand affordance that says the cell opens. `aria-hidden` on the plate and a
 * screen-reader sentence beside it, because a row of masked glyphs has nothing
 * to read out.
 *
 * ---------------------------------------------------------------------------
 * THE FLOW
 * ---------------------------------------------------------------------------
 * The purple runs DOWNWARDS, Collected to Estimated, which is the direction of
 * the claim: you start at the number and walk back to the event. It is the
 * `draw` verb — the thread grows from its leading edge, each link starting as
 * the one above it finishes — plus one ambient carrier that repeats the trip
 * so the panel reads as live rather than as a diagram that has finished.
 * Both are gated on `data-motion`, so the authored state is the whole chain
 * already drawn, and both pause off screen through the section observer.
 *
 * `--n` is the link's position, used for the stagger. It is authored per item
 * rather than read from `:nth-child` so the delay chain stays visible in the
 * markup.
 *
 * The root is a `group` Reveal, which is the variant that carries state and
 * applies no effect of its own. That is deliberate and it is the gotcha the
 * motion notes warn about: the CSS below keys off `[data-inview="true"]`, so
 * the attribute has to be on `.chain` itself and not on the wrapper the page
 * puts around it.
 */

const LINKS = [
  { stage: 'Collected', basis: 'Ledger', detail: 'A payment against the account' },
  { stage: 'Attended', basis: 'PMS record', detail: 'An attendance status on the appointment' },
  { stage: 'Booked', basis: 'PMS record', detail: 'An appointment with a date and a clinician' },
  { stage: 'Estimated', basis: 'Modelled', detail: 'Your fee schedule, against the opportunity' },
];

/**
 * The masked amount: glyph blocks, split where an amount's thousands
 * separator falls, so it reads as a redacted figure rather than as texture.
 */
const MASK_GROUPS = [3, 3];

export function ProvenanceChain() {
  return (
    <Reveal className="chain" variant="group">
      <div className="chain__figure">
        <div className="chain__cell" aria-hidden="true">
          <div className="chain__cellhead">
            <span className="chain__celltag">Collected</span>
            <span className="chain__cellopen">
              Open
              <span className="chain__caret" />
            </span>
          </div>
          <div className="chain__mask">
            {MASK_GROUPS.map((count, group) => (
              <span className="chain__maskgroup" key={group}>
                {Array.from({ length: count }, (_, digit) => (
                  <span className="chain__digit" key={digit} />
                ))}
              </span>
            ))}
          </div>
        </div>
        <span className="gl-sr">
          A collected figure, shown without a value because no client data appears on this website
        </span>
        <span className="chain__figurelabel">Any figure on the dashboard</span>
      </div>

      {/* The carrier belongs to the run, not to a link, so it lives on this
          wrapper: one pulse making one trip down, rather than four pulses
          restarting at every node. */}
      <div className="chain__run">
        <span className="chain__carrier" aria-hidden="true" />
        <ol className="chain__links">
          {LINKS.map((link, i) => (
            <li className="chain__link" key={link.stage} style={{ '--n': i } as CSSProperties}>
              <span className="chain__thread" aria-hidden="true">
                <span className="chain__flow" />
              </span>
              <span className="chain__node" aria-hidden="true" />
              <span className="chain__stage">{link.stage}</span>
              <span className="chain__basis">{link.basis}</span>
              <span className="chain__detail">{link.detail}</span>
            </li>
          ))}
        </ol>
      </div>

      <p className="chain__foot micro">
        Four links down, and the last one is the call, enquiry or record that started it. Nothing in
        the chain is averaged with anything else in it.
      </p>
    </Reveal>
  );
}
