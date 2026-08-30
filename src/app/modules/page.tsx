import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { ModuleTimeline } from '@/components/modules/ModuleTimeline';
import { Reveal } from '@/components/motion/Reveal';
import {
  ActionLink,
  KeyValueStrip,
  PullStatement,
  SectionHeader,
  TextLink,
} from '@/components/primitives';
import { MODULES } from '@/content/modules';
import { MODULES_PAGE } from '@/content/pages';
import { CTA } from '@/content/site';

export const metadata: Metadata = {
  title: 'Modules',
  description:
    'Answer, Respond, Retain and Reactivate: four modules covering first contact, first response, booked capacity and dormant records, all reporting into the same four value stages.',
  alternates: { canonical: '/modules' },
};

export default function ModulesPage() {
  return (
    <>
      <PageHeader
        label={MODULES_PAGE.label}
        title={MODULES_PAGE.title}
        emphasis={MODULES_PAGE.emphasis}
        lead={MODULES_PAGE.lead}
        strip={MODULES_PAGE.strip}
      />

      {/* The organising device: one opportunity, four places it drops. ----- */}
      <section className="surface--paper on-light section" aria-labelledby="timeline-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow={MODULES_PAGE.timeline.eyebrow}
              id="timeline-title"
              title={MODULES_PAGE.timeline.title}
              emphasis={MODULES_PAGE.timeline.emphasis}
            />
          </Reveal>
          <Reveal as="p" className="lead" style={{ maxWidth: '64ch', marginBottom: 48 }}>
            {MODULES_PAGE.timeline.lead}
          </Reveal>
          <Reveal variant="card">
            <ModuleTimeline />
          </Reveal>
          <Reveal as="p" className="micro" style={{ marginTop: 28, color: 'var(--faint)' }}>
            The spans overlap deliberately. A contact that goes unanswered at nine in the evening is
            an Answer event and a Respond event, and it is counted once.
          </Reveal>
        </div>
      </section>

      {/* The four, in full. --------------------------------------------- */}
      <section className="surface--white on-light section" aria-labelledby="four-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow="The four"
              aside="Answer · Respond · Retain · Reactivate"
              id="four-title"
              title="What each one watches,"
              emphasis="and what it is allowed to do."
            />
          </Reveal>

          <div className="mods">
            {MODULES.map((mod, i) => (
              <Reveal className="mod" key={mod.slug} variant="card" index={i}>
                <div className="mod__head">
                  <span className="mod__index">{`0${mod.index}`}</span>
                  <div>
                    <h3 className="mod__name" id={mod.slug}>
                      {mod.name}
                    </h3>
                    <p className="mod__position">{mod.position}</p>
                  </div>
                </div>

                <p className="mod__lead">{mod.lead}</p>

                <div className="mod__cols">
                  <div className="mod__col">
                    <p className="label mod__collabel">Watches</p>
                    <ul className="mod__list">
                      {mod.monitors.slice(0, 3).map((item) => (
                        <li key={item.key}>{item.key}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mod__col">
                    <p className="label mod__collabel">Does</p>
                    <ul className="mod__list">
                      {mod.actions.slice(0, 3).map((item) => (
                        <li key={item.key}>{item.key}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mod__col">
                    <p className="label mod__collabel">Value stages</p>
                    <ul className="mod__list mod__list--stages">
                      {mod.stages.map((stage) => (
                        <li key={stage.stage} data-role={stage.role}>
                          <span className="mod__stagename">{stage.stage}</span>
                          <span className="mod__stagerole">{stage.role}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mod__foot">
                  <p className="micro mod__ceiling">{mod.clientControls[0]}</p>
                  <ActionLink href={`/modules/${mod.slug}`} variant="ghost">
                    {`How ${mod.name} works`}
                  </ActionLink>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The ceiling. --------------------------------------------------- */}
      <section className="surface--ink on-dark section" aria-labelledby="ceiling-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow={MODULES_PAGE.boundary.eyebrow}
              id="ceiling-title"
              title={MODULES_PAGE.boundary.title}
              emphasis={MODULES_PAGE.boundary.emphasis}
            />
          </Reveal>
          <Reveal as="p" className="lead" style={{ maxWidth: '62ch', marginBottom: 44 }}>
            {MODULES_PAGE.boundary.lead}
          </Reveal>
          <Reveal>
            <KeyValueStrip items={MODULES_PAGE.boundary.items} />
          </Reveal>
          <Reveal style={{ marginTop: 'var(--gl-s-8)' }}>
            <PullStatement
              label="The one that is not negotiable"
              title="No module makes a clinical judgement."
              emphasis="Not once, not in any form."
              body="Grow Label reads scheduling and contact data. It does not triage, assess, advise or diagnose, and anything that sounds urgent goes straight to the practice’s own emergency route."
            />
          </Reveal>
        </div>
      </section>

      {/* Where to start. ------------------------------------------------ */}
      <section className="ctaband surface--black on-dark" aria-labelledby="modules-cta">
        <div className="shell">
          <div className="ctaband__inner">
            <Reveal>
              <p className="label label--accent" style={{ marginBottom: 24 }}>
                Where to start
              </p>
              <h2 className="display d2" id="modules-cta" style={{ marginBottom: 28 }}>
                {MODULES_PAGE.close.title} <em>{MODULES_PAGE.close.emphasis}</em>
              </h2>
              <p className="body" style={{ maxWidth: '54ch' }}>
                {MODULES_PAGE.close.body}
              </p>
              <div style={{ marginTop: 36, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <ActionLink href={CTA.primary.href}>{CTA.primary.longLabel}</ActionLink>
                <ActionLink href="/platform" variant="ghost">
                  How the system fits together
                </ActionLink>
              </div>
              <p style={{ marginTop: 28 }}>
                <TextLink href="/platform#value-stages">How value is measured</TextLink>
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
