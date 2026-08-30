import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/motion/Reveal';
import { ActionLink, PullStatement, SectionHeader, TextLink } from '@/components/primitives';
import { SiteComparison } from '@/components/sector/SiteComparison';
import { RecallRail } from '@/components/sector/RecallRail';
import { getIndustry, INDUSTRIES } from '@/content/industries';
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

  const other = INDUSTRIES.find((i) => i.slug !== industry.slug);

  return (
    <>
      <PageHeader
        label={industry.label}
        meta={`${industry.workflows.length} workflow candidates`}
        title={industry.thesis.title}
        emphasis={industry.thesis.emphasis}
        lead={industry.lead}
        strip={industry.strip}
      />

      {/* § 01 — The sector thesis --------------------------------------- */}
      <section className="surface--paper on-light section" aria-labelledby="thesis-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num="§ 01 / 04"
              aside="Where it goes"
              id="thesis-title"
              title={
                industry.slug === 'veterinary'
                  ? 'Demand arrives when the desk is thinnest.'
                  : 'The highest-intent demand is already inside the practice.'
              }
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
                {industry.slug === 'veterinary' ? (
                  <>
                    <li>
                      Contact peaks outside the hours the desk is staffed for, every week, in the
                      same places.
                    </li>
                    <li>
                      Return visits are discussed rather than booked, and the record ages past the
                      point where anyone would notice.
                    </li>
                    <li>
                      A group multiplies both, and the variation between sites is usually larger
                      than anyone expects.
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      Treatment is accepted in the chair and never given a date before the patient
                      leaves.
                    </li>
                    <li>
                      The hygiene recall list is worked from the top until the day runs out, and
                      stops at a different depth every week.
                    </li>
                    <li>
                      Chair time released on the day competes with checkout, and the gap usually
                      wins.
                    </li>
                  </>
                )}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* § 02 — Workflow candidates -------------------------------------- */}
      <section className="surface--ink on-dark section" aria-labelledby="workflows-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num="§ 02 / 04"
              aside="Workflow candidates"
              id="workflows-title"
              title={`Seven ${industry.name.toLowerCase()} workflows,`}
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

      {/* § 03 — The sector-specific device -------------------------------- */}
      <section className="surface--paper on-light section" aria-labelledby="feature-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num={industry.feature.num}
              aside={industry.feature.aside}
              id="feature-title"
              title={industry.feature.title}
              emphasis={industry.feature.emphasis}
            />
          </Reveal>
          <div className="two-col">
            <Reveal>
              <p className="lead">{industry.feature.lead}</p>
              <p style={{ marginTop: 28 }}>
                <TextLink href="/methodology">How each stage is defined</TextLink>
              </p>
            </Reveal>
            <Reveal index={1}>
              {industry.feature.kind === 'sites' ? <SiteComparison /> : <RecallRail />}
            </Reveal>
          </div>
        </div>
      </section>

      {/* § 04 — Boundaries + CTA ------------------------------------------ */}
      <section className="surface--black on-dark section" aria-labelledby="boundaries-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num="§ 04 / 04"
              aside="Boundaries"
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
            {other ? (
              <ActionLink href={`/industries/${other.slug}`} variant="ghost">
                {`${other.name} instead`}
              </ActionLink>
            ) : null}
          </Reveal>
        </div>
      </section>
    </>
  );
}
