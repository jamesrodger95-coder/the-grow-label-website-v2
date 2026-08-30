import Link from 'next/link';
import type { Metadata } from 'next';
import { Reveal } from '@/components/motion/Reveal';
import { SignalField } from '@/components/motion/SignalField';
import { RecoverySequence } from '@/components/motion/RecoverySequence';
import {
  ActionLink,
  CapacityColumn,
  KeyValueStrip,
  LedgerRow,
  SectionHeader,
  StageBar,
  StepList,
  TextLink,
  type SlotState,
} from '@/components/primitives';
import { CLOSING, DETECTION, EVIDENCE, HERO, LEAKS, SECTORS, TIME_RETURNED } from '@/content/home';
import { MODULES } from '@/content/modules';
import { INDUSTRIES } from '@/content/industries';
import { CTA, SITE, VALUE_STAGES } from '@/content/site';

export const metadata: Metadata = {
  title: `${SITE.name} — revenue recovery for veterinary and dental groups`,
  description: SITE.description,
  alternates: { canonical: '/' },
};

const HERO_SLOTS: SlotState[] = [
  'filled',
  'filled',
  'open',
  'filled',
  'open',
  'open',
  'filled',
  'recovered',
  'open',
  'filled',
  'open',
  'recovered',
  'open',
  'filled',
];

const STAGE_ROWS = [
  { name: 'Estimated', width: 100, figure: 'Modelled' },
  { name: 'Booked', width: 74, figure: 'PMS record' },
  { name: 'Attended', width: 62, figure: 'PMS record' },
  { name: 'Collected', width: 55, figure: 'Ledger' },
];

export default function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* Hero — the proposition, in HTML, immediately.                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="hero on-dark" aria-labelledby="hero-title">
        <SignalField />
        <div className="shell">
          <div className="hero__inner">
            <div>
              <p className="hero__eyebrow">
                <i aria-hidden="true" />
                <span className="label label--strong">{HERO.eyebrow}</span>
              </p>
              <h1 className="display d1 hero__title" id="hero-title">
                {HERO.titleLead} <em>{HERO.titleEmphasis}</em>
              </h1>
              <p className="lead hero__lead">{HERO.lead}</p>
              <div className="hero__actions">
                <ActionLink href={CTA.primary.href}>{CTA.primary.longLabel}</ActionLink>
                <ActionLink href={CTA.methodology.href} variant="ghost">
                  {CTA.methodology.label}
                </ActionLink>
              </div>
              <div className="hero__note">
                {MODULES.map((m) => (
                  <Link className="label" key={m.slug} href={`/modules/${m.slug}`}>
                    {m.name}
                  </Link>
                ))}
                <span className="label label--accent">Four modules · one recovery system</span>
              </div>
            </div>

            <div className="hero__aside">
              <CapacityColumn
                slots={HERO_SLOTS}
                label={HERO.columnLabel}
                openLabel="6 open"
                note={HERO.columnNote}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* § 01 — Where the revenue goes                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="surface--bone on-light section" aria-labelledby="leaks-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num="§ 01 / 08"
              aside="Six points of loss"
              id="leaks-title"
              title="A busy practice and a leaking one look"
              emphasis="identical from the front desk."
            />
          </Reveal>
          <Reveal className="lead" as="p" style={{ marginBottom: 48 }}>
            Each of these is demand the practice has already paid to generate. None of them appears
            as a line on a profit and loss statement, because the transaction never happened.
          </Reveal>
          <div className="ledger">
            {LEAKS.map((leak, i) => (
              <Reveal key={leak.index} index={i}>
                <LedgerRow
                  index={leak.index}
                  title={leak.title}
                  detail={leak.detail}
                  tag={leak.module}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* § 02 — Detection                                                  */}
      {/* ---------------------------------------------------------------- */}
      <section className="surface--ink on-dark section" aria-labelledby="detection-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num={DETECTION.num}
              aside={DETECTION.aside}
              id="detection-title"
              title={DETECTION.title}
              emphasis={DETECTION.titleEmphasis}
            />
          </Reveal>
          <div className="two-col" style={{ marginBottom: 56 }}>
            <Reveal>
              {DETECTION.body.map((paragraph) => (
                <p className="body" key={paragraph.slice(0, 24)}>
                  {paragraph}
                </p>
              ))}
            </Reveal>
            <Reveal index={1}>
              <KeyValueStrip items={DETECTION.reads} />
              <p className="small" style={{ marginTop: 24, maxWidth: '58ch' }}>
                {DETECTION.boundary}
              </p>
              <p style={{ marginTop: 20 }}>
                <TextLink href="/platform">See the platform architecture</TextLink>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* § 03 — The four modules                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="surface--paper on-light section" aria-labelledby="modules-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num="§ 03 / 08"
              aside="The recovery system"
              id="modules-title"
              title="Four modules, four points"
              emphasis="in the same recovery system."
            />
          </Reveal>
          <div>
            {MODULES.map((module, i) => (
              <Reveal key={module.slug} index={i} className="modblock">
                <div>
                  <div className="modblock__name">
                    <span className="modblock__kicker">{`0${module.index}`}</span>
                    <h3 className="modblock__title">{module.name}</h3>
                  </div>
                  <p className="modblock__def">{module.summary}</p>
                </div>

                <div className="modblock__cols">
                  <dl className="modblock__col">
                    <dt>Monitors</dt>
                    {module.monitors.slice(0, 3).map((item) => (
                      <dd key={item.key}>{item.key}</dd>
                    ))}
                  </dl>
                  <dl className="modblock__col">
                    <dt>Acts on</dt>
                    {module.actions.slice(0, 3).map((item) => (
                      <dd key={item.key}>{item.key}</dd>
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

      {/* ---------------------------------------------------------------- */}
      {/* § 04 — The four value stages (signature sequence)                 */}
      {/* ---------------------------------------------------------------- */}
      <section
        className="surface--void on-dark section"
        id="value-stages"
        aria-labelledby="stages-title"
      >
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num="§ 04 / 08"
              aside="Value stages"
              id="stages-title"
              title="One number is a claim."
              emphasis="Four numbers are an account."
            />
          </Reveal>

          <RecoverySequence />

          <div className="two-col" style={{ marginTop: 'var(--gl-s-9)' }}>
            <Reveal>
              <p className="body" style={{ marginBottom: 20 }}>
                Most recovery reporting quotes a single revenue figure. Grow Label never does,
                because the four questions underneath that figure have four different answers, and
                the gaps between them are the only part worth a management conversation.
              </p>
              <p style={{ marginTop: 28 }}>
                <TextLink href="/methodology">Read the measurement methodology</TextLink>
              </p>
            </Reveal>
            <Reveal index={1}>
              <StageBar
                rows={STAGE_ROWS}
                labelledBy="stages-title"
                caption="Proportions shown are illustrative of the shape of the staircase, not a benchmark. Real figures come from a client’s own systems."
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
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* § 05 — Returned time                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="surface--bone on-light section" aria-labelledby="time-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num={TIME_RETURNED.num}
              aside={TIME_RETURNED.aside}
              id="time-title"
              title={TIME_RETURNED.title}
              emphasis={TIME_RETURNED.titleEmphasis}
            />
          </Reveal>
          <Reveal as="p" className="lead" style={{ marginBottom: 44 }}>
            {TIME_RETURNED.lead}
          </Reveal>
          <Reveal>
            <StepList items={TIME_RETURNED.items} />
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* § 06 — Evidence                                                   */}
      {/* ---------------------------------------------------------------- */}
      <section className="surface--ink on-dark section" aria-labelledby="evidence-title">
        <div className="shell ledger-field">
          <Reveal variant="group">
            <SectionHeader
              num={EVIDENCE.num}
              aside={EVIDENCE.aside}
              id="evidence-title"
              title={EVIDENCE.title}
              emphasis={EVIDENCE.titleEmphasis}
            />
          </Reveal>
          <div className="two-col">
            <Reveal className="sticky-aside">
              <p className="lead">{EVIDENCE.lead}</p>
              <p style={{ marginTop: 28 }}>
                <TextLink href="/methodology">What we cannot claim</TextLink>
              </p>
            </Reveal>
            <Reveal index={1}>
              <StepList items={EVIDENCE.items} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* § 07 — Two sectors                                                */}
      {/* ---------------------------------------------------------------- */}
      <section className="surface--deep on-light section" aria-labelledby="sectors-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num={SECTORS.num}
              aside={SECTORS.aside}
              id="sectors-title"
              title={SECTORS.title}
              emphasis={SECTORS.titleEmphasis}
            />
          </Reveal>
          <Reveal as="p" className="lead" style={{ marginBottom: 44 }}>
            {SECTORS.lead}
          </Reveal>
          <div className="split">
            {INDUSTRIES.map((industry, i) => (
              <Reveal key={industry.slug} index={i} className="split__panel">
                <span className="label label--accent">{industry.name}</span>
                <h3 className="display d4">
                  {industry.thesis.title} <em>{industry.thesis.emphasis}</em>
                </h3>
                <p className="small">{industry.lead}</p>
                <ul className="ticks">
                  {industry.workflows.slice(0, 4).map((w) => (
                    <li key={w.index}>{w.title}</li>
                  ))}
                </ul>
                <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                  <TextLink
                    href={`/industries/${industry.slug}`}
                  >{`${industry.name} workflows`}</TextLink>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* § 08 — The ask                                                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="ctaband surface--void on-dark" aria-labelledby="closing-title">
        <div className="shell">
          <div className="ctaband__inner">
            <Reveal>
              <p className="label label--accent" style={{ marginBottom: 24 }}>
                § 08 / 08 · Next step
              </p>
              <h2 className="display d2" id="closing-title" style={{ marginBottom: 28 }}>
                {CLOSING.title} <em>{CLOSING.titleEmphasis}</em>
              </h2>
              {CLOSING.body.map((paragraph) => (
                <p className="body" key={paragraph.slice(0, 24)}>
                  {paragraph}
                </p>
              ))}
              <div style={{ marginTop: 36 }}>
                <ActionLink href={CTA.primary.href}>{CTA.primary.longLabel}</ActionLink>
              </div>
            </Reveal>
            <Reveal index={1}>
              <ul className="ticks" style={{ marginBottom: 32 }}>
                {CLOSING.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <CapacityColumn
                slots={[
                  'filled',
                  'recovered',
                  'filled',
                  'recovered',
                  'filled',
                  'filled',
                  'recovered',
                  'filled',
                  'filled',
                  'recovered',
                ]}
                label="After recovery"
                openLabel="0 open"
                note="The same room, the same week, with the gaps worked while they were still fillable."
              />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
