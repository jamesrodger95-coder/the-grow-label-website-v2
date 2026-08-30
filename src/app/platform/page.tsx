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
import { CTA, VALUE_STAGES } from '@/content/site';

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
      <section className="surface--bone on-light section" aria-labelledby="architecture-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num={PLATFORM.architecture.num}
              aside={PLATFORM.architecture.aside}
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
        <div className="shell ledger-field">
          <Reveal variant="group">
            <SectionHeader
              num="§ 02 / 05"
              aside="Action layer"
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
              num={PLATFORM.controls.num}
              aside={PLATFORM.controls.aside}
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
      <section className="surface--void on-dark section" aria-labelledby="data-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num={PLATFORM.data.num}
              aside={PLATFORM.data.aside}
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
      <section className="surface--deep on-light section" aria-labelledby="reporting-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num="§ 05 / 05"
              aside="Record layer"
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
              <p className="body">
                Restated figures are shown as restatements. The previous value, the new value, the
                date and the reason are all retained, so a report from March still means in
                September what it meant in March.
              </p>
              <p style={{ marginTop: 28 }}>
                <TextLink href="/methodology">Read the full methodology</TextLink>
              </p>
            </Reveal>
            <Reveal index={1}>
              <StageBar
                rows={STAGE_ROWS}
                labelledBy="reporting-title"
                caption="Illustrative shape only. No benchmark, industry average or client figure appears anywhere on this site."
              />
              {/* A row inside a <dl> may contain only <dt> and <dd>, so the
                  index sits inside the term rather than as a sibling span. */}
              <dl className="ledger" style={{ marginTop: 40 }}>
                {VALUE_STAGES.map((stage, i) => (
                  <div className="lrow lrow--stage" key={stage.id}>
                    <dt className="lrow__key">
                      <span className="lrow__idx">{`0${i + 1}`}</span>
                      {stage.name}
                    </dt>
                    <dd className="lrow__val">{stage.definition}</dd>
                    <dd className="lrow__tag">{stage.confidence}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal style={{ marginTop: 'var(--gl-s-9)' }}>
            <PullStatement
              label="The commitment"
              title="No figure appears in reporting"
              emphasis="without the event that produced it."
              body="If an opportunity cannot be linked to a specific call, enquiry or record, it is not counted. Untraceable value is not value."
            />
          </Reveal>

          <Reveal style={{ marginTop: 48 }}>
            <ActionLink href={CTA.primary.href}>{CTA.primary.longLabel}</ActionLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
