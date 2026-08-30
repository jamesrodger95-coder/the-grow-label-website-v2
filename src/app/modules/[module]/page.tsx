import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/motion/Reveal';
import {
  ActionLink,
  SectionHeader,
  StepList,
  TextLink,
} from '@/components/primitives';
import { getModule, MODULES, MODULE_SLUGS } from '@/content/modules';

type Params = { module: string };

export function generateStaticParams(): Params[] {
  return MODULE_SLUGS.map((module) => ({ module }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { module: slug } = await params;
  const module = getModule(slug);
  if (!module) return { title: 'Module not found' };
  return {
    title: module.name,
    description: module.lead,
    alternates: { canonical: `/modules/${module.slug}` },
  };
}

export default async function ModulePage({ params }: { params: Promise<Params> }) {
  const { module: slug } = await params;
  const module = getModule(slug);
  if (!module) notFound();

  const others = MODULES.filter((m) => m.slug !== module.slug);

  return (
    <>
      <PageHeader
        label={`Module 0${module.index} / 04`}
        meta={module.position}
        title={module.name}
        lead={module.lead}
        strip={[
          { key: 'Monitors', detail: module.monitors.map((m) => m.key).join(' · ') },
          { key: 'Acts on', detail: module.actions.map((a) => a.key).join(' · ') },
          { key: 'Stays with you', detail: 'Clinical judgement, pricing, suppression, tone' },
          { key: 'Reports at', detail: 'Estimated → Booked → Attended → Collected' },
        ]}
      />

      {/* 01 — The operational problem ----------------------------------- */}
      <section className="surface--bone on-light section" aria-labelledby="problem-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num="§ 01 / 06"
              aside="The problem"
              id="problem-title"
              title={module.problem.title}
            />
          </Reveal>
          <div className="two-col">
            <Reveal>
              {module.problem.body.map((paragraph) => (
                <p className="body" key={paragraph.slice(0, 24)}>
                  {paragraph}
                </p>
              ))}
            </Reveal>
            <Reveal index={1}>
              <p className="label" style={{ marginBottom: 18 }}>
                What this module monitors
              </p>
              <div className="ledger">
                {module.monitors.map((item, i) => (
                  <div className="lrow" key={item.key} style={{ gridTemplateColumns: '2.5rem 1fr' }}>
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
          </div>
        </div>
      </section>

      {/* 02 — What it does, and what it does not ------------------------- */}
      <section className="surface--ink on-dark section" aria-labelledby="actions-title">
        <div className="shell ledger-field">
          <Reveal variant="group">
            <SectionHeader
              num="§ 02 / 06"
              aside="Actions and limits"
              id="actions-title"
              title="What it does, and"
              emphasis="what it will not do."
            />
          </Reveal>
          <div className="two-col--even two-col">
            <Reveal>
              <p className="label label--accent" style={{ marginBottom: 18 }}>
                Actions taken
              </p>
              <div className="ledger">
                {module.actions.map((item, i) => (
                  <div className="lrow" key={item.key} style={{ gridTemplateColumns: '2.5rem 1fr' }}>
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
                What your team still controls
              </p>
              <ul className="ticks">
                {module.clientControls.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="small" style={{ marginTop: 28, maxWidth: '48ch' }}>
                Every one of these is set during configuration and changeable at any time. There is
                no mode in which the module decides for itself what it is allowed to do.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 03 — Escalation -------------------------------------------------- */}
      <section className="surface--paper on-light section" aria-labelledby="escalation-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num="§ 03 / 06"
              aside="Human escalation"
              id="escalation-title"
              title="Named triggers that hand"
              emphasis="a contact to a person."
            />
          </Reveal>
          <Reveal>
            <div className="ladder">
              <div className="ladder__row">
                <span className="label">Trigger</span>
                <span className="label">What happens</span>
              </div>
              {module.escalation.map((row) => (
                <div className="ladder__row" key={row.trigger}>
                  <p className="ladder__trigger">{row.trigger}</p>
                  <p className="ladder__handover">{row.handover}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 04 — Stages and data --------------------------------------------- */}
      <section className="surface--void on-dark section" aria-labelledby="stages-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num="§ 04 / 06"
              aside="Stages and data"
              id="stages-title"
              title="Which stages it moves,"
              emphasis="and what it needs to run."
            />
          </Reveal>
          <div className="two-col--even two-col">
            <Reveal>
              <p className="label label--accent" style={{ marginBottom: 18 }}>
                Relevant revenue stages
              </p>
              <div className="matrix">
                {module.stages.map((row) => (
                  <div className="matrix__row" key={row.stage}>
                    <span className="lrow__key">{row.stage}</span>
                    <span
                      className={`matrix__role matrix__role--${row.role === 'Influences' ? 'influences' : 'observes'}`}
                    >
                      {row.role}
                    </span>
                    <span className="small">{row.note}</span>
                  </div>
                ))}
              </div>
              <p className="micro" style={{ marginTop: 18, maxWidth: '46ch' }}>
                A module that only observes a stage cannot move value into it. That distinction is
                the difference between doing the work and reporting on it.
              </p>
            </Reveal>
            <Reveal index={1}>
              <p className="label" style={{ marginBottom: 18 }}>
                Operational data required
              </p>
              <div className="ledger">
                {module.dataRequired.map((item, i) => (
                  <div className="lrow" key={item.key} style={{ gridTemplateColumns: '2.5rem 1fr' }}>
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
              <p className="label" style={{ margin: '32px 0 16px' }}>
                Explicitly not required
              </p>
              <ul className="ticks">
                {module.dataNotRequired.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 05 — Evidence ---------------------------------------------------- */}
      <section className="surface--deep on-light section" aria-labelledby="evidence-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num="§ 05 / 06"
              aside="Evidence"
              id="evidence-title"
              title="What you can open"
              emphasis="and inspect."
            />
          </Reveal>
          <Reveal>
            <StepList
              items={module.evidence.map((e, i) => ({
                index: `0${i + 1}`,
                title: e.key,
                detail: e.detail,
              }))}
            />
          </Reveal>
        </div>
      </section>

      {/* 06 — Outcome + CTA ----------------------------------------------- */}
      <section className="ctaband surface--void on-dark" aria-labelledby="outcome-title">
        <div className="shell">
          <div className="ctaband__inner">
            <Reveal>
              <p className="label label--accent" style={{ marginBottom: 24 }}>
                § 06 / 06 · Commercial outcome
              </p>
              <h2 className="display d2" id="outcome-title" style={{ marginBottom: 28 }}>
                What changes on the schedule <em>and in the ledger.</em>
              </h2>
              {module.outcome.map((paragraph) => (
                <p className="body" key={paragraph.slice(0, 24)}>
                  {paragraph}
                </p>
              ))}
              <div style={{ marginTop: 36 }}>
                <ActionLink href={module.cta.href}>
                  {`${module.cta.label} for ${module.name}`}
                </ActionLink>
              </div>
            </Reveal>
            <Reveal index={1}>
              <p className="label" style={{ marginBottom: 18 }}>
                The other three modules
              </p>
              <div className="ledger">
                {others.map((other) => (
                  <Link
                    className="lrow"
                    key={other.slug}
                    href={`/modules/${other.slug}`}
                    style={{ gridTemplateColumns: '2.5rem 1fr auto' }}
                  >
                    <span className="lrow__idx">{`0${other.index}`}</span>
                    <span>
                      <span className="lrow__key" style={{ display: 'block', marginBottom: 4 }}>
                        {other.name}
                      </span>
                      <span className="lrow__val">{other.summary}</span>
                    </span>
                    <span className="label label--accent" aria-hidden="true">
                      &rarr;
                    </span>
                  </Link>
                ))}
              </div>
              <p style={{ marginTop: 24 }}>
                <TextLink href="/platform">How the four fit together</TextLink>
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
