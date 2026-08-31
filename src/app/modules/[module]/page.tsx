import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/motion/Reveal';
import { ActionLink, SectionHeader, StepList, TextLink } from '@/components/primitives';
import { ModuleRail } from '@/components/layout/ModuleRail';
import { ModuleScene } from '@/components/modules/scene';
import { ModuleSwitcher } from '@/components/modules/ModuleSwitcher';
import { getModule, MODULES, MODULE_SLUGS } from '@/content/modules';

type Params = { module: string };

export function generateStaticParams(): Params[] {
  return MODULE_SLUGS.map((slug) => ({ module: slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { module: slug } = await params;
  const mod = getModule(slug);
  if (!mod) return { title: 'Module not found' };
  return {
    title: mod.name,
    description: mod.lead,
    alternates: { canonical: `/modules/${mod.slug}` },
  };
}

export default async function ModulePage({ params }: { params: Promise<Params> }) {
  const { module: slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();

  const others = MODULES.filter((m) => m.slug !== mod.slug);

  return (
    <>
      <PageHeader
        label="Module"
        title={mod.name}
        lead={mod.lead}
        aside={<ModuleRail current={mod.slug} />}
        strip={[
          { key: 'Monitors', detail: mod.monitors.map((m) => m.key).join(' · ') },
          { key: 'Acts on', detail: mod.actions.map((a) => a.key).join(' · ') },
          { key: 'Stays with you', detail: 'Clinical judgement, pricing, suppression, tone' },
          { key: 'Reports at', detail: 'Estimated → Booked → Attended → Collected' },
        ]}
      />

      {/* 01 — The operational problem, and the scene that shows it ------- */}
      <section className="surface--paper on-light section" aria-labelledby="problem-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader eyebrow="The problem" id="problem-title" title={mod.problem.title} />
          </Reveal>
          <div className="two-col">
            <Reveal>
              {mod.problem.body.map((paragraph) => (
                <p className="body" key={paragraph.slice(0, 24)}>
                  {paragraph}
                </p>
              ))}
              {mod.problem.figure ? (
                <div className="proofnum">
                  <p className="proofnum__value">{mod.problem.figure.value}</p>
                  <p className="proofnum__label">{mod.problem.figure.label}</p>
                  <p className="proofnum__basis micro">{mod.problem.figure.basis}</p>
                </div>
              ) : null}
            </Reveal>
            <Reveal index={1}>
              <ModuleScene slug={mod.slug} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 01b — What it does, in operational language ---------------------- */}
      {mod.operation ? (
        <section className="surface--white on-light section" aria-labelledby="operation-title">
          <div className="shell">
            <Reveal variant="group">
              <SectionHeader
                eyebrow="What it does"
                id="operation-title"
                title="What changes at the desk"
                emphasis="on the first Monday."
              />
            </Reveal>
            <div className="two-col">
              <Reveal>
                {mod.operation.map((paragraph) => (
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
                  {mod.monitors.map((item, i) => (
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
            </div>
          </div>
        </section>
      ) : null}

      {/* 02 — What it does, and what it does not ------------------------- */}
      <section className="surface--ink on-dark section" aria-labelledby="actions-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow="Actions and limits"
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
                {mod.actions.map((item, i) => (
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
                What your team still controls
              </p>
              <ul className="ticks">
                {mod.clientControls.map((item) => (
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

      {/* 02b — What it connects to ---------------------------------------- */}
      {mod.connects ? (
        <section className="surface--white on-light section" aria-labelledby="connects-title">
          <div className="shell">
            <Reveal variant="group">
              <SectionHeader
                eyebrow="What it connects to"
                id="connects-title"
                title="The systems you already run,"
                emphasis="and the channels it works."
              />
            </Reveal>
            <div className="two-col--even two-col">
              <Reveal>
                <p className="label" style={{ marginBottom: 18 }}>
                  Systems of record
                </p>
                <div className="ledger">
                  {mod.connects.systems.map((item, i) => (
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
                  Channels it works
                </p>
                <div className="ledger">
                  {mod.connects.channels.map((item, i) => (
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
                <p className="small" style={{ marginTop: 28, maxWidth: '48ch' }}>
                  {mod.connects.note}
                </p>
              </Reveal>
            </div>
          </div>
        </section>
      ) : null}

      {/* 02c — What the practice sees ------------------------------------- */}
      {mod.dashboard ? (
        <section className="surface--paper on-light section" aria-labelledby="dashboard-title">
          <div className="shell">
            <Reveal variant="group">
              <SectionHeader
                eyebrow="On the dashboard"
                id="dashboard-title"
                title="What you can see"
                emphasis="on Monday morning."
              />
            </Reveal>
            <Reveal>
              <StepList
                items={mod.dashboard.map((item, i) => ({
                  index: `0${i + 1}`,
                  title: item.key,
                  detail: item.detail,
                }))}
              />
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* 03 — Escalation -------------------------------------------------- */}
      <section className="surface--paper on-light section" aria-labelledby="escalation-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow="Human escalation"
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
              {mod.escalation.map((row) => (
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
      <section className="surface--black on-dark section" aria-labelledby="stages-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow="Stages and data"
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
                {mod.stages.map((row) => (
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
                {mod.dataRequired.map((item, i) => (
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
              <p className="label" style={{ margin: '32px 0 16px' }}>
                Explicitly not required
              </p>
              <ul className="ticks">
                {mod.dataNotRequired.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 04b — What it does not do ---------------------------------------- */}
      {mod.doesNot ? (
        <section className="surface--white on-light section" aria-labelledby="doesnot-title">
          <div className="shell">
            <Reveal variant="group">
              <SectionHeader
                eyebrow="Boundaries"
                id="doesnot-title"
                title={`What ${mod.name} does not do,`}
                emphasis="stated plainly."
              />
            </Reveal>
            <div className="boundaries">
              {mod.doesNot.map((item, i) => (
                <Reveal key={item.key} index={i} className="boundary">
                  <p className="boundary__key">{item.key}</p>
                  <p className="boundary__detail small">{item.detail}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* 05 — Evidence ---------------------------------------------------- */}
      <section className="surface--mist on-light section" aria-labelledby="evidence-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow="Evidence"
              id="evidence-title"
              title="What you can open"
              emphasis="and inspect."
            />
          </Reveal>
          <Reveal>
            <StepList
              items={mod.evidence.map((e, i) => ({
                index: `0${i + 1}`,
                title: e.key,
                detail: e.detail,
              }))}
            />
          </Reveal>
        </div>
      </section>

      {/* 06 — Outcome + CTA ----------------------------------------------- */}
      <section className="ctaband surface--black on-dark" aria-labelledby="outcome-title">
        <div className="shell">
          <div className="ctaband__inner">
            <Reveal>
              <p className="label label--accent" style={{ marginBottom: 24 }}>
                Commercial outcome
              </p>
              <h2 className="display d2" id="outcome-title" style={{ marginBottom: 28 }}>
                What changes on the schedule <em>and in the ledger.</em>
              </h2>
              {mod.outcome.map((paragraph) => (
                <p className="body" key={paragraph.slice(0, 24)}>
                  {paragraph}
                </p>
              ))}
              <div style={{ marginTop: 36 }}>
                <ActionLink href={mod.cta.href}>{`${mod.cta.label} for ${mod.name}`}</ActionLink>
              </div>
            </Reveal>
            <Reveal index={1}>
              <p className="label" style={{ marginBottom: 18 }}>
                The other three modules
              </p>
              <div className="ledger">
                {others.map((other) => (
                  <Link
                    className="lrow lrow--pair-action"
                    key={other.slug}
                    href={`/modules/${other.slug}`}
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

          <Reveal index={2} style={{ marginTop: 'var(--gl-s-9)' }}>
            <ModuleSwitcher current={mod.slug} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
