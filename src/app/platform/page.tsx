import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/motion/Reveal';
import {
  ActionLink,
  PullStatement,
  SectionHeader,
  StageBar,
  StepList,
  TextLink,
} from '@/components/primitives';
import { PLATFORM } from '@/content/pages';
import { MODULES } from '@/content/modules';
import { AUDIT_QUESTIONS, CANNOT_CLAIM, STAGE_DEFINITIONS } from '@/content/methodology';
import { CTA } from '@/content/site';

export const metadata: Metadata = {
  title: 'Platform',
  description:
    'How Grow Label reads the events your systems already produce, turns lost demand into tracked opportunities, and reports the result at four separate value stages.',
  alternates: { canonical: '/platform' },
};

const STAGE_ROWS = [
  { name: 'Estimated', width: 100, figure: 'Modelled' },
  { name: 'Booked', width: 74, figure: 'PMS record' },
  { name: 'Attended', width: 62, figure: 'PMS record' },
  { name: 'Collected', width: 55, figure: 'Ledger' },
];

export default function PlatformPage() {
  return (
    <>
      <PageHeader
        label={PLATFORM.label}
        meta="Four layers · four modules · four stages"
        title={PLATFORM.title}
        emphasis={PLATFORM.emphasis}
        lead={PLATFORM.lead}
        strip={PLATFORM.strip}
      />

      {/* § 01 — Architecture -------------------------------------------- */}
      <section className="surface--paper on-light section" aria-labelledby="architecture-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow={PLATFORM.architecture.aside}
              id="architecture-title"
              title={PLATFORM.architecture.title}
              emphasis={PLATFORM.architecture.emphasis}
            />
          </Reveal>
          <Reveal as="p" className="lead" style={{ marginBottom: 48 }}>
            {PLATFORM.architecture.lead}
          </Reveal>

          <div className="steps">
            {PLATFORM.architecture.layers.map((layer, i) => (
              <Reveal className="step" key={layer.index} index={i}>
                <span className="step__num">{layer.index}</span>
                <div>
                  <h3 className="step__title" style={{ marginBottom: 10 }}>
                    {layer.title}
                  </h3>
                  <p className="label">{`Produces · ${layer.artefact}`}</p>
                </div>
                <p className="small">{layer.detail}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* § 02 — The modules in one place --------------------------------- */}
      <section className="surface--ink on-dark section" aria-labelledby="modules-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow="Action layer"
              id="modules-title"
              title="Four modules, each with"
              emphasis="a ceiling you set."
            />
          </Reveal>
          <div>
            {MODULES.map((module, i) => (
              <Reveal className="modblock" key={module.slug} index={i}>
                <div>
                  <div className="modblock__name">
                    <span className="modblock__kicker">{`0${module.index}`}</span>
                    <h3 className="modblock__title">{module.name}</h3>
                  </div>
                  <p className="modblock__def">{module.summary}</p>
                </div>
                <div className="modblock__cols">
                  <dl className="modblock__col">
                    <dt>Acts on</dt>
                    {module.actions.slice(0, 3).map((a) => (
                      <dd key={a.key}>{a.key}</dd>
                    ))}
                  </dl>
                  <dl className="modblock__col">
                    <dt>Stays with you</dt>
                    {module.clientControls.slice(0, 3).map((c) => (
                      <dd key={c}>{c}</dd>
                    ))}
                  </dl>
                </div>
                <div className="modblock__side">
                  <p className="micro">{module.position}</p>
                  <TextLink href={`/modules/${module.slug}`}>{`Read ${module.name}`}</TextLink>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* § 03 — Controls ------------------------------------------------- */}
      <section className="surface--paper on-light section" aria-labelledby="controls-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow={PLATFORM.controls.aside}
              id="controls-title"
              title={PLATFORM.controls.title}
              emphasis={PLATFORM.controls.emphasis}
            />
          </Reveal>
          <div className="two-col">
            <Reveal className="sticky-aside">
              <p className="lead">{PLATFORM.controls.lead}</p>
            </Reveal>
            <Reveal index={1}>
              <StepList items={PLATFORM.controls.items} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* § 04 — Data boundary -------------------------------------------- */}
      <section className="surface--black on-dark section" aria-labelledby="data-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow={PLATFORM.data.aside}
              id="data-title"
              title={PLATFORM.data.title}
              emphasis={PLATFORM.data.emphasis}
            />
          </Reveal>
          <Reveal as="p" className="lead" style={{ marginBottom: 44 }}>
            {PLATFORM.data.lead}
          </Reveal>

          <div className="two-col--even two-col">
            <Reveal>
              <p className="label label--accent" style={{ marginBottom: 18 }}>
                What is read
              </p>
              <div className="ledger">
                {PLATFORM.data.required.map((item, i) => (
                  <div className="lrow lrow--pair" key={item.key}>
                    <span className="lrow__idx">{`0${i + 1}`}</span>
                    <span>
                      <span className="lrow__key" style={{ display: 'block', marginBottom: 4 }}>
                        {item.key}
                      </span>
                      <span className="lrow__val">{item.detail}</span>
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal index={1}>
              <p className="label" style={{ marginBottom: 18 }}>
                What is never read
              </p>
              <ul className="ticks">
                {PLATFORM.data.excluded.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="small" style={{ marginTop: 28, maxWidth: '48ch' }}>
                The boundary is drawn at the point where scheduling data becomes clinical data.
                Nothing on the clinical side of that line is required, requested or stored.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* § 05 — Reporting ------------------------------------------------ */}
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
                date and the reason are all retained, so a report from March still means in
                September what it meant in March.
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

      {/* Limits — the argument the reporting has to survive ---------------- */}
      <section
        className="surface--black on-dark section"
        id="limits"
        aria-labelledby="limits-title"
      >
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow="Limits"
              id="limits-title"
              title={CANNOT_CLAIM.title}
              emphasis={CANNOT_CLAIM.emphasis}
            />
          </Reveal>
          <Reveal as="p" className="lead" style={{ marginBottom: 44, maxWidth: '62ch' }}>
            {CANNOT_CLAIM.lead}
          </Reveal>
          <Reveal>
            <StepList items={CANNOT_CLAIM.items} />
          </Reveal>

          <div className="two-col" style={{ marginTop: 'var(--gl-s-9)' }}>
            <Reveal>
              <p className="label label--accent" style={{ marginBottom: 20 }}>
                Use this against us
              </p>
              <h3 className="display d3" style={{ marginBottom: 20 }}>
                Five questions to ask <em>any provider in this category.</em>
              </h3>
              <p className="body">
                Including us. If a provider cannot answer all five without changing the subject, the
                number they are quoting is not one that will survive a board meeting.
              </p>
              <div style={{ marginTop: 32, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <ActionLink href={CTA.primary.href}>{CTA.primary.longLabel}</ActionLink>
              </div>
            </Reveal>
            <Reveal index={1}>
              <ol className="ledger">
                {AUDIT_QUESTIONS.map((question, i) => (
                  <li className="lrow lrow--pair" key={question}>
                    <span className="lrow__idx">{`0${i + 1}`}</span>
                    <span className="lrow__val">{question}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
