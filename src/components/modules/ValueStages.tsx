import { Reveal } from '@/components/motion/Reveal';
import { PullStatement, SectionHeader, StageBar } from '@/components/primitives';
import { STAGE_DEFINITIONS } from '@/content/methodology';

/**
 * How value is measured: the four stages, their definitions and the
 * commitment behind them.
 *
 * Moved from the platform page when that page was retired; it now closes the
 * modules page, beside the modules whose results it governs, and keeps the
 * `#value-stages` anchor every "how value is measured" link on the site
 * points at.
 */

const STAGE_ROWS = [
  { name: 'Estimated', width: 100, figure: 'Modelled' },
  { name: 'Booked', width: 74, figure: 'PMS record' },
  { name: 'Attended', width: 62, figure: 'PMS record' },
  { name: 'Collected', width: 55, figure: 'Ledger' },
];

export function ValueStages() {
  return (
    <section
      className="surface--mist on-light section"
      id="value-stages"
      aria-labelledby="reporting-title"
    >
      <div className="shell">
        <Reveal variant="group">
          <SectionHeader
            eyebrow="How value is measured"
            id="reporting-title"
            title="Reporting that is built"
            emphasis="to be argued with."
          />
        </Reveal>
        <div className="two-col">
          <Reveal>
            <p className="body" style={{ marginBottom: 20 }}>
              Every figure carries the basis on which it is asserted and links back to the event
              that produced it. Attribution status is editable by the client, and a disputed item
              stays visible in the record with the dispute attached.
            </p>
            <p className="body" style={{ marginBottom: 20 }}>
              Restated figures are shown as restatements. The previous value, the new value, the
              date and the reason are all retained, so a report from March still means in September
              what it meant in March.
            </p>
            <p className="body">
              A figure moves to the next stage only when a system record says it has. Nothing is
              promoted on inference, and nothing is promoted because a reasonable person would
              assume it happened.
            </p>
          </Reveal>
          <Reveal index={1}>
            <StageBar
              rows={STAGE_ROWS}
              labelledBy="reporting-title"
              caption="Illustrative shape only. No benchmark, industry average or client figure appears anywhere on this site."
            />
          </Reveal>
        </div>

        {/* The definitions that used to sit on their own page. They belong
            beside the reporting they govern, not one click away from it. */}
        <div className="defs" style={{ marginTop: 'var(--gl-s-8)' }}>
          {STAGE_DEFINITIONS.map((stage, i) => (
            <Reveal className="def" key={stage.name} index={i}>
              <div>
                <h3 className="def__term">{stage.name}</h3>
                <p className="label def__meta">{`Confidence · ${stage.confidence}`}</p>
                <p className="label" style={{ marginTop: 8 }}>
                  {`Promoted by · ${stage.promotedBy}`}
                </p>
              </div>
              <div>
                <p className="body" style={{ marginBottom: 14 }}>
                  {stage.body}
                </p>
                <p className="small" style={{ display: 'flex', gap: 12 }}>
                  <span className="label label--accent" style={{ flex: 'none', paddingTop: 4 }}>
                    Caution
                  </span>
                  <span>{stage.caution}</span>
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal style={{ marginTop: 'var(--gl-s-9)' }}>
          <PullStatement
            label="The commitment"
            title="No figure appears in reporting"
            emphasis="without the event that produced it."
            body="If an opportunity cannot be linked to a specific call, enquiry or record, it is not counted. Untraceable value is not value."
          />
        </Reveal>
      </div>
    </section>
  );
}
