import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { RecoveryPipeline } from '@/components/home/RecoveryPipeline';
import { Results } from '@/components/home/Results';
import { ReadsIngest } from '@/components/home/ReadsIngest';
import { DeskBoard } from '@/components/home/DeskBoard';
import { ProvenanceChain } from '@/components/home/ProvenanceChain';
import { Testimonials } from '@/components/home/Testimonials';
import { VideoTestimonials } from '@/components/home/VideoTestimonials';
import { Team } from '@/components/home/Team';
import { Reveal, RevealLines } from '@/components/motion/Reveal';
import { RecoverySequence } from '@/components/motion/RecoverySequence';
import { ActionLink, CapacityColumn, StageBar, StepList, TextLink } from '@/components/primitives';
import { CLOSING, DETECTION, EVIDENCE, SECTORS, TIME_RETURNED } from '@/content/home';
import { MODULES } from '@/content/modules';
import { INDUSTRIES } from '@/content/industries';
import { READS_STRIP } from '@/content/proof';
import { CTA, SITE, VALUE_STAGES } from '@/content/site';

export const metadata: Metadata = {
  title: `${SITE.name}: revenue recovery for veterinary and dental groups`,
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
        <div className="strip" data-ambient="on" aria-hidden="true">
          <div className="strip__track">
            {[...READS_STRIP, ...READS_STRIP].map((item, i) => (
              <span className="strip__item" key={i}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* The six points of loss are off the homepage for now.

          Not deleted. `src/components/home/Leaks.tsx` and `LEAK_GROUPS` in
          `src/content/home.ts` are untouched, and every one of the six rows is
          still reachable — each was a link to the module that works it, and
          those module pages carry the same argument in more detail.

          The reason it is off: the page now runs hero -> the strip naming what
          the platform reads -> detection, which is the job. Naming six losses
          before the reader has been told anything can see them spent a full
          section on the problem while the hero had only just stated it.

          To restore: put back the import at the top of this file and the line
          below. It belongs here, between the strip and detection, if it comes
          back at all. */}
      {/* <Leaks /> */}

      {/* ---------------------------------------------------------------- */}
      {/* Detection                                                         */}
      {/* ---------------------------------------------------------------- */}
      <section className="surface--ink on-dark section" aria-labelledby="detection-title">
        <div className="shell">
          <div className="sec-head">
            <div>
              <RevealLines
                as="h2"
                id="detection-title"
                className="display d2"
                lines={DETECTION.titleLines.map((line, i) =>
                  i === 1 ? <em key={line}>{line}</em> : line
                )}
              />
            </div>
          </div>

          <div className="detect">
            <Reveal variant="rise" className="detect__copy">
              {DETECTION.body.map((paragraph) => (
                <p className="body" key={paragraph.slice(0, 24)}>
                  {paragraph}
                </p>
              ))}
              <p className="detect__boundary small">{DETECTION.boundary}</p>
              <p style={{ margin: 0 }}>
                <TextLink href="/platform">See the platform architecture</TextLink>
              </p>
            </Reveal>

            <Reveal variant="card" index={1} className="detect__visual">
              <RecoveryPipeline />
            </Reveal>
          </div>

          {/* Four lanes feeding one record, replacing the four-up card grid
              that used to sit here. Full width on purpose: the two visuals
              either side of it are right-hand panels, and breaking the column
              rhythm once is what stops the page reading as a template. */}
          <Reveal variant="rise" className="detect__reads">
            <ReadsIngest />
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Three clients, on camera                                          */}
      {/*                                                                   */}
      {/* Directly after detection and before the modules, on purpose. The  */}
      {/* page has just spent two sections arguing that demand is being     */}
      {/* lost and that the platform can see it; this is the first point at */}
      {/* which somebody other than us says so. Putting it after the four   */}
      {/* modules would have made the reader take the mechanism on trust    */}
      {/* first and meet the evidence for it second.                        */}
      {/* ---------------------------------------------------------------- */}
      <VideoTestimonials />

      {/* ---------------------------------------------------------------- */}
      {/* The four modules                                                  */}
      {/* ---------------------------------------------------------------- */}
      <section className="surface--paper on-light section" aria-labelledby="modules-title">
        <div className="shell">
          <div className="sec-head">
            <div>
              <RevealLines
                as="h2"
                id="modules-title"
                className="display d2"
                lines={['Four modules, four points', <em key="e">in the same system.</em>]}
              />
            </div>
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
              <RevealLines
                as="h2"
                id="stages-title"
                className="display d2"
                lines={['One number is a claim.', <em key="e">Four numbers are an account.</em>]}
              />
            </div>
          </div>

          <RecoverySequence />

          <div className="two-col" style={{ marginTop: 'var(--gl-s-9)' }}>
            <Reveal variant="rise" className="sticky-aside">
              <p className="body" style={{ marginBottom: 20 }}>
                Most recovery reporting quotes one figure. We never do. The four questions
                underneath it have four different answers, and the gaps between them are the only
                part worth a management conversation.
              </p>
              <p style={{ marginTop: 26 }}>
                <TextLink href="/platform#value-stages">How a figure is promoted</TextLink>
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

      {/* Between the four-stage argument and the worked example of it. The
          quotations are about the operational change, not about the numbers,
          so they sit where the reader has just been told how the numbers work
          and is about to be shown a set of them. */}
      <Testimonials />

      <Results />

      {/* ---------------------------------------------------------------- */}
      {/* Returned time                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="surface--white on-light section" aria-labelledby="time-title">
        <div className="shell">
          <div className="sec-head">
            <div>
              <RevealLines
                as="h2"
                id="time-title"
                className="display d2"
                lines={['The second return is hours', <em key="e">back at the front desk.</em>]}
              />
            </div>
          </div>
          {/* Visual on the LEFT here. The detection panel above and the
              evidence chain below are both right-hand, so this is the beat
              that keeps the page from marching down one side. */}
          <div className="two-col two-col--flip">
            <Reveal variant="rise" className="two-col__visual">
              <DeskBoard />
            </Reveal>
            <Reveal variant="rise" index={1}>
              <p className="lead" style={{ marginBottom: 32 }}>
                {TIME_RETURNED.lead}
              </p>
              {/* `glow` lights each number as it arrives. The five jobs on
                  the board to the left are the same five in the same order,
                  so the list is read down rather than scanned, and the
                  arriving number is what keeps the two halves in step. */}
              <StepList items={TIME_RETURNED.items} glow />
            </Reveal>
          </div>
        </div>
      </section>

      {/* The case-study section is off the homepage for now.

          It is not deleted, and it is deliberately not deleted: the six
          write-ups are the only long-form worked examples on the site, and
          `/case-studies` still carries them, still labelled. What it could not
          do was sit two sections away from six real, named client
          testimonials while every card on it said "Placeholder case study".
          Restore this line once the studies are real engagements.

          The primary nav item for case studies now points at `/case-studies`
          rather than at the `#case-studies` anchor this used to render. */}
      {/* <CaseStudies /> */}

      {/* ---------------------------------------------------------------- */}
      {/* Evidence                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="surface--ink on-dark section" aria-labelledby="evidence-title">
        <div className="shell">
          <div className="sec-head">
            <div>
              <RevealLines
                as="h2"
                id="evidence-title"
                className="display d2"
                lines={['Every figure opens into', <em key="e">the event that produced it.</em>]}
              />
            </div>
          </div>
          {/* Even columns. The default `two-col` gives the left column an aside
              width, and the five-property list was being squeezed into a
              measure it could not hold once the chain took the right-hand
              side. */}
          <div className="two-col two-col--even">
            <Reveal variant="rise">
              <p className="lead" style={{ marginBottom: 32 }}>
                {EVIDENCE.lead}
              </p>
              <StepList items={EVIDENCE.items} />
              <p style={{ marginTop: 26 }}>
                <TextLink href="/platform#limits">What we cannot claim</TextLink>
              </p>
            </Reveal>
            {/* The quiet variant, on the right. No chrome bar and no motion of
                its own: the pipeline two sections above already shows an event
                becoming a record, and a second full instrument making the same
                shape would cost the first one its authority. */}
            <Reveal variant="rise" index={1}>
              <ProvenanceChain />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Two sectors                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="surface--white on-light section" aria-labelledby="sectors-title">
        <div className="shell">
          <div className="sec-head">
            <div>
              <RevealLines
                as="h2"
                id="sectors-title"
                className="display d2"
                lines={['Veterinary and dental lose', <em key="e">money in different places.</em>]}
              />
            </div>
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
                <ActionLink href="/platform#value-stages" variant="ghost">
                  See how value is measured
                </ActionLink>
              </div>
            </Reveal>
            {/* No parallax here. A drift is a fifth motion verb on a site
                that has four, it carried no meaning, and it was the only use
                of it anywhere. */}
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
          </div>
        </div>
      </section>
    </>
  );
}
