import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SectorHero } from '@/components/sector/SectorHero';
import { FaqList } from '@/components/layout/Faq';
import { Reveal } from '@/components/motion/Reveal';
import {
  ActionLink,
  KeyValueStrip,
  PullStatement,
  SectionHeader,
  TextLink,
} from '@/components/primitives';
import { SiteComparison } from '@/components/sector/SiteComparison';
import { RecallRail } from '@/components/sector/RecallRail';
import { getIndustry, INDUSTRIES } from '@/content/industries';
import { CASE_STUDIES } from '@/content/illustrative';
import { SECTOR_FAQ } from '@/content/faq';
import { CTA } from '@/content/site';

type Params = { industry: string };

export function generateStaticParams(): Params[] {
  return INDUSTRIES.map((i) => ({ industry: i.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { industry: slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return { title: 'Sector not found' };
  return {
    title: `${industry.name} revenue recovery`,
    description: industry.lead,
    alternates: { canonical: `/industries/${industry.slug}` },
  };
}

export default async function IndustryPage({ params }: { params: Promise<Params> }) {
  const { industry: slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const others = INDUSTRIES.filter((i) => i.slug !== industry.slug);
  const studies = CASE_STUDIES.filter((study) => study.sectorSlug === industry.slug);
  const faq = SECTOR_FAQ[industry.slug];

  return (
    <>
      <SectorHero industry={industry} />

      {/* The operating facts, immediately under the opening. */}
      <section className="surface--paper on-light" aria-label={`${industry.name} at a glance`}>
        <div className="shell" style={{ paddingBlock: 'clamp(28px, 3.4vw, 52px)' }}>
          <Reveal>
            <KeyValueStrip items={industry.strip} />
          </Reveal>
        </div>
      </section>

      {/* The sector thesis --------------------------------------- */}
      <section className="surface--white on-light section" aria-labelledby="thesis-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow="Where it goes"
              id="thesis-title"
              title={industry.thesis.headline}
            />
          </Reveal>
          <div className="two-col">
            <Reveal>
              {industry.thesis.body.map((paragraph) => (
                <p className="body" key={paragraph.slice(0, 24)}>
                  {paragraph}
                </p>
              ))}
            </Reveal>
            <Reveal index={1}>
              <p className="label" style={{ marginBottom: 18 }}>
                The two patterns, in one sentence each
              </p>
              <ul className="ticks">
                {industry.thesis.patterns.map((pattern) => (
                  <li key={pattern.slice(0, 24)}>{pattern}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Workflow candidates -------------------------------------- */}
      <section className="surface--ink on-dark section" aria-labelledby="workflows-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow="Workflow candidates"
              id="workflows-title"
              title={`${industry.workflows.length} ${industry.name.toLowerCase()} workflows,`}
              emphasis="and the data each one reads."
            />
          </Reveal>
          <Reveal as="p" className="lead" style={{ marginBottom: 44 }}>
            These are candidates rather than case studies. Each describes a place demand is commonly
            lost, the data that would need to be available to act on it, and the module that would
            do the work.
          </Reveal>

          <div className="ledger">
            {industry.workflows.map((workflow, i) => (
              <Reveal key={workflow.index} index={i}>
                <div className="lrow">
                  <span className="lrow__idx">{workflow.index}</span>
                  <span>
                    <span className="lrow__key" style={{ display: 'block', marginBottom: 6 }}>
                      {workflow.title}
                    </span>
                    <span className="lrow__val">{workflow.problem}</span>
                  </span>
                  <span>
                    <span className="label" style={{ display: 'block', marginBottom: 6 }}>
                      Reads
                    </span>
                    <span className="lrow__val">{workflow.reads}</span>
                  </span>
                  <span className="lrow__tag accent">{workflow.module}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The sector-specific device -------------------------------- */}
      <section className="surface--paper on-light section" aria-labelledby="feature-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow={industry.feature.aside}
              id="feature-title"
              title={industry.feature.title}
              emphasis={industry.feature.emphasis}
            />
          </Reveal>
          <div className="two-col">
            <Reveal>
              <p className="lead">{industry.feature.lead}</p>
              <p style={{ marginTop: 28 }}>
                <TextLink href="/platform#value-stages">How each stage is defined</TextLink>
              </p>
            </Reveal>
            <Reveal index={1}>
              {industry.feature.kind === 'sites' ? (
                <SiteComparison />
              ) : (
                <RecallRail variant={industry.slug === 'med-spa' ? 'med-spa' : 'dental'} />
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {studies.length > 0 ? (
        <>
          {/* Written up: the three studies for this sector. -------------------- */}
          <section className="surface--white on-light section" aria-labelledby="sector-cases-title">
            <div className="shell">
              <Reveal variant="group">
                <SectionHeader
                  eyebrow="Written up"
                  aside={`${studies.length} studies`}
                  id="sector-cases-title"
                  title={`Three ${industry.name.toLowerCase()} write-ups,`}
                  emphasis="reported at four stages."
                />
              </Reveal>

              <div className="entries">
                {studies.map((study, i) => (
                  <Reveal key={study.slug} index={i}>
                    <Link className="entry" href={`/case-studies/${study.slug}`}>
                      <span>
                        <span className="label label--accent" style={{ display: 'block' }}>
                          {study.chips.join(' · ')}
                        </span>
                        <span
                          className="label"
                          style={{ display: 'block', marginTop: 10, textTransform: 'none' }}
                        >
                          {`${study.shape} · ${study.period}`}
                        </span>
                      </span>
                      <span>
                        <span
                          className="entry__title"
                          style={{ display: 'block', marginBottom: 10 }}
                        >
                          {study.title}
                        </span>
                        <span className="small">{study.summary}</span>
                      </span>
                      <span className="label label--accent" aria-hidden="true">
                        Read &rarr;
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : null}

      {/* Sector questions. ------------------------------------------------- */}
      <section className="surface--mist on-light section" aria-labelledby="sector-faq-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow="Questions"
              id="sector-faq-title"
              title={`What ${industry.name.toLowerCase()} practices`}
              emphasis="ask first."
            />
          </Reveal>
          <div className="two-col">
            <Reveal className="sticky-aside">
              <p className="lead">
                The four that come up in almost every scoping call for this sector. The commercial
                questions — price, terms and what the assessment costs — are answered in full on the
                contact page.
              </p>
              <p style={{ marginTop: 26 }}>
                <TextLink href="/contact">Price, terms and data questions</TextLink>
              </p>
            </Reveal>
            <Reveal index={1}>
              <FaqList items={faq} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Boundaries + CTA -------------------------------------------------- */}
      <section className="surface--black on-dark section" aria-labelledby="boundaries-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow="Boundaries"
              id="boundaries-title"
              title="What this system"
              emphasis="never does."
            />
          </Reveal>
          <div className="two-col">
            <Reveal>
              <ul className="ticks">
                {industry.boundaries.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal index={1}>
              <PullStatement
                title="No clinical claim appears"
                emphasis="anywhere in this product."
                body="Grow Label works on scheduling and contact data. Clinical judgement, urgency and treatment decisions belong to the practice, and every clinical trigger routes there immediately and unanswered."
              />
            </Reveal>
          </div>

          <Reveal style={{ marginTop: 56, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <ActionLink href={CTA.primary.href}>
              {`Request a ${industry.name.toLowerCase()} assessment`}
            </ActionLink>
            {others.map((other) => (
              <ActionLink key={other.slug} href={`/industries/${other.slug}`} variant="ghost">
                {`${other.name} instead`}
              </ActionLink>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
