/**
 * EVIDENCE — the quieter variant.
 *
 * The claim is that every figure opens into the event that produced it. That
 * is a claim about a chain, so the drawing is a chain: a collected figure at
 * the top, and four links down to the telephony event underneath it.
 *
 * This is deliberately the QUIET version of the device rather than a second
 * instrument panel. It has no titled chrome bar, no readout row and no
 * animation of its own. `RecoveryPipeline` two screens above already shows an
 * event becoming a record, and a second full panel making the same shape
 * would have cost the first one its authority. What this adds is the
 * direction the first one does not show: downwards, from a number back to
 * the thing that caused it.
 *
 * The value at the top is a hatched blank rather than a figure, for the same
 * reason it is blank inside the pipeline: there is no client data on this
 * site, and drawing a plausible number here would be the exact failure the
 * section is arguing against.
 */

const LINKS = [
  { stage: 'Collected', basis: 'Ledger', detail: 'A payment against the account' },
  { stage: 'Attended', basis: 'PMS record', detail: 'An attendance status on the appointment' },
  { stage: 'Booked', basis: 'PMS record', detail: 'An appointment with a date and a clinician' },
  { stage: 'Estimated', basis: 'Modelled', detail: 'Your fee schedule, against the opportunity' },
];

export function ProvenanceChain() {
  return (
    <div className="chain">
      <div className="chain__figure">
        <span className="chain__value" aria-hidden="true" />
        <span className="gl-sr">
          A collected figure, shown without a value because no client data appears on this website
        </span>
        <span className="chain__figurelabel">Any figure on the dashboard</span>
      </div>

      <ol className="chain__links">
        {LINKS.map((link) => (
          <li className="chain__link" key={link.stage}>
            <span className="chain__thread" aria-hidden="true" />
            <span className="chain__node" aria-hidden="true" />
            <span className="chain__stage">{link.stage}</span>
            <span className="chain__basis">{link.basis}</span>
            <span className="chain__detail">{link.detail}</span>
          </li>
        ))}
      </ol>

      <p className="chain__foot micro">
        Four links down, and the last one is the call, enquiry or record that started it. Nothing in
        the chain is averaged with anything else in it.
      </p>
    </div>
  );
}
