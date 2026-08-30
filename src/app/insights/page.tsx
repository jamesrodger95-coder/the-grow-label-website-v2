import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/motion/Reveal';
import { ActionLink, SectionHeader } from '@/components/primitives';
import { INSIGHTS } from '@/content/pages';
import { CTA } from '@/content/site';

export const metadata: Metadata = {
  title: 'Insights',
  description:
    'Notes on measurement, scheduling and revenue operations for veterinary and dental groups.',
  alternates: { canonical: '/insights' },
};

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export default function InsightsPage() {
  return (
    <>
      <PageHeader
        label="Insights"
        meta={`${INSIGHTS.length} notes`}
        title="Notes on measurement,"
        emphasis="scheduling and the back book."
        lead="Written for people who have to defend a number in a management meeting. No sponsored research, no benchmark claims, and nothing that requires evidence we do not have."
      />

      <section className="surface--paper on-light section" aria-labelledby="index-title">
        <div className="shell">
          <Reveal variant="group">
            <SectionHeader
              num="§ 01 / 02"
              aside="Index"
              id="index-title"
              title="Everything published"
              emphasis="so far."
            />
          </Reveal>

          <div className="entries">
            {INSIGHTS.map((insight, i) => (
              <Reveal key={insight.slug} index={i}>
                <Link className="entry" href={`/insights/${insight.slug}`}>
                  <span>
                    <span className="label label--accent" style={{ display: 'block' }}>
                      {insight.kicker}
                    </span>
                    <span
                      className="label"
                      style={{ display: 'block', marginTop: 10, textTransform: 'none' }}
                    >
                      <time dateTime={insight.date}>
                        {dateFormat.format(new Date(insight.date))}
                      </time>
                      {` · ${insight.readingTime}`}
                    </span>
                  </span>
                  <span>
                    <span className="entry__title" style={{ display: 'block', marginBottom: 10 }}>
                      {insight.title}
                    </span>
                    <span className="small">{insight.summary}</span>
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

      <section className="ctaband surface--black on-dark" aria-labelledby="insights-cta">
        <div className="shell">
          <div className="ctaband__inner">
            <Reveal>
              <p className="label label--accent" style={{ marginBottom: 24 }}>
                § 02 / 02 · Next step
              </p>
              <h2 className="display d2" id="insights-cta" style={{ marginBottom: 28 }}>
                The argument is easier <em>with your own numbers in it.</em>
              </h2>
              <p className="body">
                An assessment applies the same definitions to a window of your own operational data
                and returns a written view of where demand is being lost.
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
