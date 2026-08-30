import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { Results } from '@/components/home/Results';
import { CaseStudies } from '@/components/home/CaseStudies';
import { Testimonials } from '@/components/home/Testimonials';
import { VideoTestimonials } from '@/components/home/VideoTestimonials';
import { Team } from '@/components/home/Team';
import { Reveal, RevealLines } from '@/components/motion/Reveal';
import { Parallax } from '@/components/motion/Parallax';
import { RecoverySequence } from '@/components/motion/RecoverySequence';
import {
  ActionLink,
  CapacityColumn,
  KeyValueStrip,
  LedgerRow,
  StageBar,
  StepList,
  TextLink,
} from '@/components/primitives';
import { CLOSING, DETECTION, EVIDENCE, LEAKS, SECTORS, TIME_RETURNED } from '@/content/home';
import { MODULES } from '@/content/modules';
import { INDUSTRIES } from '@/content/industries';
import { READS_STRIP } from '@/content/proof';
import { CTA, SITE, VALUE_STAGES } from '@/content/site';

export const metadata: Metadata = {
  title: `${SITE.name} — revenue recovery for veterinary and dental groups`,
  description: SITE.description,
  alternates: { canonical: '/' },
};

const STAGE_ROWS = [
  { name: 'Estimated', width: 100, figure: 'Modelled' },
  { name: 'Booked', width: 74, figure: 'PMS record' },
  { name: 'Attended', width: 61, figure: 'PMS record' },
  { name: 'Collected', width: 52, figure: 'Ledger' },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* A quiet band naming what the platform actually reads. */}
      <div className="surface--white on-light">
        <div className="strip" aria-hidden="true">
          <div className="strip__track">
            {[...READS_STRIP, ...READS_STRIP].map((item, i) => (
              <span className="strip__item" key={i}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Where the revenue goes                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="surface--white on-light section" aria-labelledby="leaks-title">
        <div className="shell">
          <div className="sec-head">
            <div>
              <Reveal variant="rise">
                <span className="eyebrow sec-head__eyebrow">Where it goes</span>
              </Reveal>
              <RevealLines
                as="h2"
                id="leaks-title"
                className="display d2"
                lines={['A busy practice and a leaking', <em key="e">one look identical.</em>]}
              />
            </div>
            <p className="sec-head__aside">Six points of loss</p>
          </div>

          <Reveal className="lead" as="p" variant="rise" style={{ marginBottom: 44 }}>
            Every one of these is demand your practice has already paid to generate. None of them
            shows up on a profit and loss statement, because the transaction never happened.
          </Reveal>

          <div className="ledger">
            {LEAKS.map((leak, i) => (
              <Reveal key={leak.index} index={i} variant="wipe">
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
      {/* Detection                                                         */}
      {/* ---------------------------------------------------------------- */}
      <section className="surface--ink on-dark section" aria-labelledby="detection-title">
        <div className="shell">
          <div className="sec-head">
            <div>
              <Reveal variant="rise">
                <span className="eyebrow sec-head__eyebrow">Detection</span>
              </Reveal>
              <RevealLines
                as="h2"
                id="detection-title"
                className="display d2"
                lines={[
                  'Detection is the whole job.',
                  <em key="e">The rest is follow-through.</em>,
                ]}
              />
            </div>
            <p className="sec-head__aside">Event, opportunity, action</p>
          </div>

          <div className="two-col" style={{ marginBottom: 48 }}>
            <Reveal variant="rise" className="sticky-aside">
              {DETECTION.body.map((paragraph) => (
                <p className="body" key={paragraph.slice(0, 24)}>
                  {paragraph}
                </p>
              ))}
              <p style={{ marginTop: 26 }}>
                <TextLink href="/platform">See the platform architecture</TextLink>
              </p>
            </Reveal>
            <Reveal variant="card" index={1}>
              <KeyValueStrip items={DETECTION.reads} />
              <p className="small" style={{ marginTop: 24, maxWidth: '56ch' }}>
                {DETECTION.boundary}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* The four modules                                                  */}
      {/* ---------------------------------------------------------------- */}
      <section className="surface--paper on-light section" aria-labelledby="modules-title">
        <div className="shell">
          <div className="sec-head">
            <div>
              <Reveal variant="rise">
                <span className="eyebrow sec-head__eyebrow">The recovery system</span>
              </Reveal>
              <RevealLines
                as="h2"
                id="modules-title"
                className="display d2"
                lines={['Four modules, four points', <em key="e">in the same system.</em>]}
              />
            </div>
            <p className="sec-head__aside">Answer · Respond · Retain · Reactivate</p>
          </div>

          <div>
            {MODULES.map((module, i) => (
              <Reveal key={module.slug} index={i} variant="card" className="modblock">
                <div>
                  <div className="modblock__name">
                    <span className="modblock__kicker">{`0${module.index}`}</span>
                    <h3 className="modblock__title">{module.name}</h3>
                  </div>
                  <p className="modblock__def">{module.summary}</p>
                </div>

                <div className="modblock__cols">
                  <dl className="modblock__col">
                    <dt>Watches</dt>
                    {module.monitors.slice(0, 3).map((item) => (
                      <dd key={item.key}>{item.key}</dd>
                    ))}
                  </dl>
                  <dl className="modblock__col">
                    <dt>Does</dt>
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
      {/* The four value stages — the pinned signature scene                */}
      {/* ---------------------------------------------------------------- */}
      <section
        className="surface--black on-dark section"
        id="value-stages"
        aria-labelledby="stages-title"
      >
        <div className="shell">
          <div className="sec-head">
            <div>
              <Reveal variant="rise">
                <span className="eyebrow sec-head__eyebrow">Value stages</span>
              </Reveal>
              <RevealLines
                as="h2"
                id="stages-title"
                className="display d2"
                lines={['One number is a claim.', <em key="e">Four numbers are an account.</em>]}
              />
            </div>
            <p className="sec-head__aside">Scroll to follow</p>
          </div>

          <RecoverySequence />

          <div className="two-col" style={{ marginTop: 'var(--gl-s-9)' }}>
            <Reveal variant="rise" className="sticky-aside">
              <p className="body" style={{ marginBottom: 20 }}>
                Most recovery reporting quotes one figure. We never do, because the four questions
                underneath it have four different answers — and the gaps between them are the only
                part worth a management conversation.
              </p>
              <p style={{ marginTop: 26 }}>
                <TextLink href="/methodology">Read the measurement methodology</TextLink>
              </p>
            </Reveal>
            <Reveal variant="card" index={1}>
              <StageBar
                rows={STAGE_ROWS}
                labelledBy="stages-title"
                caption="Illustrative of the shape of the staircase, not a benchmark. Real figures come from a client’s own systems."
              />
              <dl className="ledger" style={{ marginTop: 36 }}>
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

      <Results />

      {/* ---------------------------------------------------------------- */}
      {/* Returned time                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="surface--white on-light section" aria-labelledby="time-title">
        <div className="shell">
          <div className="sec-head">
            <div>
              <Reveal variant="rise">
                <span className="eyebrow sec-head__eyebrow">{TIME_RETURNED.aside}</span>
              </Reveal>
              <RevealLines
                as="h2"
                id="time-title"
                className="display d2"
                lines={['The second return is hours', <em key="e">back at the front desk.</em>]}
              />
            </div>
            <p className="sec-head__aside">Five recurring jobs</p>
          </div>
          <Reveal as="p" className="lead" variant="rise" style={{ marginBottom: 40 }}>
            {TIME_RETURNED.lead}
          </Reveal>
          <Reveal variant="wipe">
            <StepList items={TIME_RETURNED.items} />
          </Reveal>
        </div>
      </section>

      <CaseStudies />

      {/* ---------------------------------------------------------------- */}
      {/* Evidence                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="surface--ink on-dark section" aria-labelledby="evidence-title">
        <div className="shell">
          <div className="sec-head">
            <div>
              <Reveal variant="rise">
                <span className="eyebrow sec-head__eyebrow">{EVIDENCE.aside}</span>
              </Reveal>
              <RevealLines
                as="h2"
                id="evidence-title"
                className="display d2"
                lines={['Every figure opens into', <em key="e">the event that produced it.</em>]}
              />
            </div>
            <p className="sec-head__aside">Five properties of the record</p>
          </div>
          <div className="two-col">
            <Reveal variant="rise" className="sticky-aside">
              <p className="lead">{EVIDENCE.lead}</p>
              <p style={{ marginTop: 26 }}>
                <TextLink href="/methodology">What we cannot claim</TextLink>
              </p>
            </Reveal>
            <Reveal variant="wipe" index={1}>
              <StepList items={EVIDENCE.items} />
            </Reveal>
          </div>
        </div>
      </section>

      <Testimonials />
      <VideoTestimonials />

      {/* ---------------------------------------------------------------- */}
      {/* Two sectors                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="surface--white on-light section" aria-labelledby="sectors-title">
        <div className="shell">
          <div className="sec-head">
            <div>
              <Reveal variant="rise">
                <span className="eyebrow sec-head__eyebrow">{SECTORS.aside}</span>
              </Reveal>
              <RevealLines
                as="h2"
                id="sectors-title"
                className="display d2"
                lines={['Veterinary and dental lose', <em key="e">money in different places.</em>]}
              />
            </div>
            <p className="sec-head__aside">Two products, not one page</p>
          </div>
          <Reveal as="p" className="lead" variant="rise" style={{ marginBottom: 40 }}>
            {SECTORS.lead}
          </Reveal>
          <div className="split">
            {INDUSTRIES.map((industry, i) => (
              <Reveal key={industry.slug} index={i} variant="card" className="split__panel">
                <span className="eyebrow">{industry.name}</span>
                <h3 className="display d3">
                  {industry.thesis.title} <em>{industry.thesis.emphasis}</em>
                </h3>
                <p className="small">{industry.lead}</p>
                <ul className="ticks">
                  {industry.workflows.slice(0, 4).map((w) => (
                    <li key={w.index}>{w.title}</li>
                  ))}
                </ul>
                <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                  <TextLink href={`/industries/${industry.slug}`}>
                    {`${industry.name} workflows`}
                  </TextLink>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Team />

      {/* ---------------------------------------------------------------- */}
      {/* The ask                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="ctaband surface--black on-dark" aria-labelledby="closing-title">
        <div className="shell">
          <div className="ctaband__inner">
            <Reveal variant="rise">
              <span className="eyebrow" style={{ marginBottom: 22 }}>
                Next step
              </span>
              <RevealLines
                as="h2"
                id="closing-title"
                className="display d1"
                lines={['Start with an assessment,', <em key="e">not a contract.</em>]}
              />
              <div style={{ marginTop: 26 }}>
                {CLOSING.body.map((paragraph) => (
                  <p className="body" key={paragraph.slice(0, 24)}>
                    {paragraph}
                  </p>
                ))}
              </div>
              <div style={{ marginTop: 34, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <ActionLink href={CTA.primary.href}>{CTA.primary.longLabel}</ActionLink>
                <ActionLink href="/methodology" variant="ghost">
                  Read the methodology
                </ActionLink>
              </div>
            </Reveal>
            <Parallax distance={34}>
              <Reveal variant="card" index={1}>
                <ul className="ticks" style={{ marginBottom: 30 }}>
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
            </Parallax>
          </div>
        </div>
      </section>
    </>
  );
}
