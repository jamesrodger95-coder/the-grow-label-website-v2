import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/motion/Reveal';
import { ActionLink, SectionHeader, TextLink } from '@/components/primitives';
import { CASE_STUDIES, ILLUSTRATIVE } from '@/content/illustrative';
import { CTA } from '@/content/site';

export const metadata: Metadata = {
  title: 'Case studies',
  description:
    'Six write-ups of veterinary and dental revenue recovery, each reported at four separate value stages. Placeholder studies: the workflows are real, the organisations and figures are not.',
  alternates: { canonical: '/case-studies' },
};

const SECTORS = ['Veterinary', 'Dental'] as const;

export default function CaseStudiesIndexPage() {
  return (
    <>
      <PageHeader
        label="Case studies"
        meta={`${CASE_STUDIES.length} studies · three per sector`}
        title="Six write-ups of the work,"
        emphasis="in the shape a real one takes."
        lead="Each study describes a place demand is commonly lost, what an assessment finds when it looks there, what the modules do about it, and what that produces at each of the four value stages — including the part that never becomes revenue."
        strip={[
          { key: 'Structure', detail: 'Situation · what was found · what changed · four stages' },
          { key: 'Figures', detail: 'Estimated, booked, attended and collected, never blended' },
          { key: 'Sectors', detail: 'Three veterinary, three dental' },
          { key: 'Status', detail: 'Placeholder studies, labelled on every page' },
        ]}
      />

      <section className="surface--paper on-light section" aria-labelledby="cases-index-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              eyebrow="Index"
              id="cases-index-title"
              title="Everything written up"
              emphasis="so far."
            />
          </Reveal>

          <Reveal className="results__note" style={{ marginTop: 0, marginBottom: 40 }}>
            <span className="placeholder-tag">{ILLUSTRATIVE.caseTag}</span>
            <p className="small" style={{ flex: '1 1 22rem', margin: 0 }}>
              {ILLUSTRATIVE.notice} Every study below is labelled on its own page, on every figure
              it carries.
            </p>
            <TextLink href="/platform#limits">What we can and cannot claim</TextLink>
          </Reveal>

          {SECTORS.map((sector) => (
            <div key={sector} style={{ marginBottom: 'var(--gl-s-8)' }}>
              <Reveal as="p" className="label label--accent" style={{ marginBottom: 20 }}>
                {sector}
              </Reveal>
              <div className="entries">
                {CASE_STUDIES.filter((study) => study.sector === sector).map((study, i) => (
                  <Reveal key={study.slug} index={i}>
                    <Link className="entry" href={`/case-studies/${study.slug}`}>
                      <span>
                        <span className="label label--accent" style={{ display: 'block' }}>
                          {study.shape}
                        </span>
                        <span
                          className="label"
                          style={{ display: 'block', marginTop: 10, textTransform: 'none' }}
                        >
                          {study.period}
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
          ))}
        </div>
      </section>

      <section className="ctaband surface--black on-dark" aria-labelledby="cases-cta">
        <div className="shell">
          <div className="ctaband__inner ctaband__inner--single">
            <Reveal>
              <p className="label label--accent" style={{ marginBottom: 24 }}>
                Next step
              </p>
              <h2 className="display d2" id="cases-cta" style={{ marginBottom: 28 }}>
                The version of this <em>with your own numbers in it.</em>
              </h2>
              <p className="body">
                An assessment applies the same structure to a defined window of your own operational
                data: where demand was lost, what it is worth at estimated value, and which modules
                would address it. No figure in it is modelled from anybody else’s practice.
              </p>
              <div style={{ marginTop: 36 }}>
                <ActionLink href={CTA.primary.href}>{CTA.primary.longLabel}</ActionLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
