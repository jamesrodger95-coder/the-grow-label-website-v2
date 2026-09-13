import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/motion/Reveal';
import { ActionLink, SectionHeader, StageBar, StepList, TextLink } from '@/components/primitives';
import { CASE_STUDIES, getCaseStudy } from '@/content/illustrative';
import { CTA } from '@/content/site';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: 'Case study not found' };
  return {
    title: study.title,
    description: study.summary,
    alternates: { canonical: `/case-studies/${study.slug}` },
    // A fabricated study must never be indexed as though it were evidence.
    robots: study.illustrative ? { index: false, follow: true } : undefined,
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const others = CASE_STUDIES.filter((other) => other.slug !== study.slug).slice(0, 3);
  const top = Number(study.stages[0]?.value.replace(/[^\d.]/g, '') ?? 0);
  const stageRows = study.stages.map((stage) => ({
    name: stage.stage,
    width: top
      ? Math.max(10, Math.round((Number(stage.value.replace(/[^\d.]/g, '')) / top) * 100))
      : 0,
    figure: stage.value,
  }));

  return (
    <>
      <PageHeader
        label={`${study.sector} case study`}
        meta={`${study.shape} · ${study.period}`}
        title={study.title}
        lead={study.summary}
        strip={study.profile}
      />

      {/* The situation ---------------------------------------------------- */}
      <section className="surface--paper on-light section" aria-labelledby="situation-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow="The situation"
              id="situation-title"
              title="What the group could see,"
              emphasis="and what it could not."
            />
          </Reveal>
          <div className="two-col">
            <Reveal>
              {study.situation.map((paragraph) => (
                <p className="body" key={paragraph.slice(0, 24)}>
                  {paragraph}
                </p>
              ))}
            </Reveal>
            <Reveal index={1}>
              <p className="label" style={{ marginBottom: 18 }}>
                What the assessment found
              </p>
              <div className="ledger">
                {study.found.map((item, i) => (
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

      {/* What changed ----------------------------------------------------- */}
      <section className="surface--ink on-dark section" aria-labelledby="changed-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow="What changed"
              id="changed-title"
              title="Three changes at the desk,"
              emphasis="and one that was never on the table."
            />
          </Reveal>
          <Reveal>
            <StepList
              items={study.changed.map((item, i) => ({
                index: `0${i + 1}`,
                title: item.key,
                detail: item.detail,
              }))}
            />
          </Reveal>
          <Reveal as="p" className="small" style={{ marginTop: 32, maxWidth: '60ch' }}>
            Every one of these operates inside a ceiling the practice set during configuration and
            can lower at any time. Clinical judgement was never inside it.
          </Reveal>
        </div>
      </section>

      {/* The four stages -------------------------------------------------- */}
      <section className="surface--mist on-light section" aria-labelledby="cs-stages-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow="Reported value"
              id="cs-stages-title"
              title="Four figures,"
              emphasis="and only one of them is revenue."
            />
          </Reveal>
          <div className="two-col">
            <Reveal>
              <p className="body" style={{ marginBottom: 20 }}>
                The distance between these four is the part worth a management conversation. A large
                gap between estimated and booked is a conversion problem in the contact workflow. A
                large gap between booked and attended is a confirmation problem. A large gap between
                attended and collected is a billing problem, and it is not a recovery problem at
                all.
              </p>
              <dl className="ledger">
                {study.stages.map((stage, i) => (
                  <div className="lrow lrow--stage" key={stage.stage}>
                    <dt className="lrow__key">
                      <span className="lrow__idx">{`0${i + 1}`}</span>
                      {stage.stage}
                    </dt>
                    <dd className="lrow__val">{stage.basis}</dd>
                    <dd className="lrow__tag">{stage.value}</dd>
                  </div>
                ))}
              </dl>
              <p style={{ marginTop: 26 }}>
                <TextLink href="/platform#value-stages">How a figure is promoted</TextLink>
              </p>
            </Reveal>
            <Reveal index={1}>
              <StageBar
                rows={stageRows}
                labelledBy="cs-stages-title"
                caption={`${study.period}. No benchmark, industry average or comparison to another practice appears anywhere on this site.`}
              />

              <div className="cs-metrics">
                {study.metrics.map((metric) => (
                  <div className="cs-metric" key={metric.label}>
                    <p className="cs-metric__value">{metric.value}</p>
                    <p className="cs-metric__label">{metric.label}</p>
                    <p className="cs-metric__basis micro">{metric.basis}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The quotation and the caveats ------------------------------------ */}
      <section className="surface--white on-light section" aria-labelledby="cs-quote-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow="In their words"
              id="cs-quote-title"
              title="What it changed"
              emphasis="for the people running it."
            />
          </Reveal>
          {/* Even columns. The default `two-col` gives the left column an aside
              width, and the quotation is the point of this section rather than
              a note beside it. */}
          <div className="two-col two-col--even">
            <Reveal>
              <figure className="cs-quote">
                <blockquote className="cs-quote__text">
                  <p>{study.quote.text}</p>
                </blockquote>
                <figcaption className="cs-quote__who">
                  <span className="quote__name">{study.quote.name}</span>
                  <span className="quote__role">
                    {study.quote.role} · {study.quote.org}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
            <Reveal index={1}>
              <p className="label" style={{ marginBottom: 18 }}>
                What this does not show
              </p>
              <ul className="ticks">
                {study.caveats.map((caveat) => (
                  <li key={caveat}>{caveat}</li>
                ))}
              </ul>
              <p className="small" style={{ marginTop: 28, maxWidth: '48ch' }}>
                A study that only lists what worked is a marketing document. These limits are part
                of the write-up because they are part of the result.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Close ------------------------------------------------------------- */}
      <section className="ctaband surface--black on-dark" aria-labelledby="cs-cta">
        <div className="shell">
          <div className="ctaband__inner">
            <Reveal>
              <p className="label label--accent" style={{ marginBottom: 24 }}>
                Next step
              </p>
              <h2 className="display d2" id="cs-cta" style={{ marginBottom: 28 }}>
                The same structure, <em>applied to your own data.</em>
              </h2>
              <p className="body">
                An assessment reads a defined window of your operational data and reports what it
                finds at estimated, booked, attended and collected value, separately, with a plain
                statement of what the data cannot tell us.
              </p>
              <div style={{ marginTop: 36, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <ActionLink href={CTA.primary.href}>{CTA.primary.longLabel}</ActionLink>
                <ActionLink href={`/industries/${study.sectorSlug}`} variant="ghost">
                  {`${study.sector} workflows`}
                </ActionLink>
              </div>
            </Reveal>
            <Reveal index={1}>
              <p className="label" style={{ marginBottom: 18 }}>
                Other studies
              </p>
              <div className="ledger">
                {others.map((other) => (
                  <Link
                    className="lrow lrow--action"
                    key={other.slug}
                    href={`/case-studies/${other.slug}`}
                  >
                    <span>
                      <span className="lrow__key" style={{ display: 'block', marginBottom: 4 }}>
                        {other.title}
                      </span>
                      <span className="lrow__val">{`${other.sector} · ${other.shape}`}</span>
                    </span>
                    <span className="label label--accent" aria-hidden="true">
                      &rarr;
                    </span>
                  </Link>
                ))}
              </div>
              <p style={{ marginTop: 24 }}>
                <TextLink href="/case-studies">All six case studies</TextLink>
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
