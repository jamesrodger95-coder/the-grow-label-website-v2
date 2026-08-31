import { PIPELINE } from '@/content/home';

/**
 * The signature product visual for the detection section.
 *
 * One tracked opportunity at a time, shown the way the system actually holds
 * it: a raw event, the record it becomes, and the action that closes it. Four
 * scenarios cycle, one per module, so the animation is explaining the product
 * rather than decorating the page.
 *
 * Deliberately a server component. All four scenarios are in the DOM and only
 * opacity cycles, driven by CSS `animation-delay` — there is no JavaScript,
 * no state and no client bundle cost, and with scripts blocked the panel still
 * renders a complete, readable record. Under reduced motion the cycle stops on
 * the first scenario and the rest are hidden from the accessibility tree by the
 * same stacking that hides them visually.
 *
 * The layers are stacked in one grid cell so the panel sizes to the tallest
 * scenario and nothing reflows as they swap.
 */
export function RecoveryPipeline() {
  return (
    <div className="pipe" data-ambient="on">
      <div className="pipe__bar">
        <span className="pipe__live">
          <span className="pipe__dot" aria-hidden="true" />
          Working
        </span>
        <span className="pipe__barlabel">Opportunity record</span>
      </div>

      {/* The travelling scan, which is the only purely atmospheric part. */}
      <span className="pipe__scan" aria-hidden="true" />

      <div className="pipe__stack">
        {PIPELINE.map((step, i) => (
          <article
            className="pipe__card"
            key={step.id}
            style={{ '--i': i, '--n': PIPELINE.length } as React.CSSProperties}
          >
            <div className="pipe__zone">
              <div className="pipe__zonehead">
                <span className="pipe__zonename">Event</span>
                <span className="pipe__stamp mono">{step.event.stamp}</span>
              </div>
              <p className="pipe__headline">{step.event.channel}</p>
              <p className="pipe__detail">{step.event.detail}</p>
            </div>

            <div className="pipe__link" aria-hidden="true">
              <span className="pipe__linkline" />
              <span className="pipe__linkmark">↓</span>
            </div>

            <div className="pipe__zone pipe__zone--opp">
              <div className="pipe__zonehead">
                <span className="pipe__zonename">Opportunity</span>
                <span className="pipe__module">{step.module}</span>
              </div>
              <p className="pipe__headline mono">{step.opportunity.ref}</p>
              <dl className="pipe__fields">
                <div>
                  <dt>Owner</dt>
                  <dd>{step.opportunity.owner}</dd>
                </div>
                <div>
                  <dt>Due</dt>
                  <dd>{step.opportunity.due}</dd>
                </div>
                <div>
                  <dt>Value</dt>
                  <dd>
                    <span className="pipe__slot" aria-hidden="true" />
                    <span className="gl-sr">Estimated from the practice’s own fee schedule</span>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="pipe__link" aria-hidden="true">
              <span className="pipe__linkline" />
              <span className="pipe__linkmark">↓</span>
            </div>

            <div className="pipe__zone">
              <div className="pipe__zonehead">
                <span className="pipe__zonename">Action</span>
                <span className="pipe__stage">
                  <span className="pipe__stagedot" aria-hidden="true" />
                  {step.action.stage}
                </span>
              </div>
              <p className="pipe__headline">{step.action.did}</p>
              <p className="pipe__detail">
                Counted at <strong>{step.action.stage}</strong>, against the event it came from.
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="pipe__ticks" aria-hidden="true">
        {PIPELINE.map((step, i) => (
          <span
            className="pipe__tick"
            key={step.id}
            style={{ '--i': i, '--n': PIPELINE.length } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
