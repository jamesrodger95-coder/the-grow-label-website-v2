import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { ActionLink } from '@/components/primitives';
import { getInsight, INSIGHTS } from '@/content/pages';
import { CTA } from '@/content/site';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return INSIGHTS.map((i) => ({ slug: i.slug }));
}

export const dynamicParams = false;

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) return { title: 'Note not found' };
  return {
    title: insight.title,
    description: insight.summary,
    alternates: { canonical: `/insights/${insight.slug}` },
    openGraph: {
      type: 'article',
      title: insight.title,
      description: insight.summary,
      publishedTime: insight.date,
    },
  };
}

export default async function InsightPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) notFound();

  const others = INSIGHTS.filter((i) => i.slug !== insight.slug);

  return (
    <>
      <article>
        <header className="phead surface--void on-dark">
          <div className="shell">
            <div className="phead__inner">
              <div className="phead__meta">
                <span className="label label--accent">{insight.kicker}</span>
                <span className="label" style={{ textTransform: 'none' }}>
                  <time dateTime={insight.date}>{dateFormat.format(new Date(insight.date))}</time>
                  {` · ${insight.readingTime}`}
                </span>
              </div>
              <Reveal variant="reveal">
                <h1 className="display d2 phead__title" style={{ maxWidth: '22ch' }}>
                  {insight.title}
                </h1>
              </Reveal>
              <Reveal as="p" className="lead phead__lead" index={1}>
                {insight.summary}
              </Reveal>
            </div>
          </div>
        </header>

        <div className="surface--bone on-light section">
          <div className="shell">
            <div className="two-col">
              <Reveal>
                <p className="label" style={{ marginBottom: 16 }}>
                  In this note
                </p>
                <ul className="ticks">
                  {insight.body.map((section) => (
                    <li key={section.heading}>{section.heading}</li>
                  ))}
                </ul>
              </Reveal>
              <Reveal className="prose" index={1}>
                {insight.body.map((section) => (
                  <section key={section.heading}>
                    <h2>{section.heading}</h2>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                    ))}
                    {section.list ? (
                      <ul>
                        {section.list.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                ))}
              </Reveal>
            </div>
          </div>
        </div>
      </article>

      <section className="ctaband surface--void on-dark" aria-labelledby="insight-more">
        <div className="shell">
          <div className="ctaband__inner">
            <Reveal>
              <h2 className="display d3" id="insight-more" style={{ marginBottom: 28 }}>
                Apply this to <em>your own numbers.</em>
              </h2>
              <p className="body">
                An assessment reads a defined window of your operational data and reports what it
                finds at estimated, booked, attended and collected value, separately.
              </p>
              <div style={{ marginTop: 36 }}>
                <ActionLink href={CTA.primary.href}>{CTA.primary.longLabel}</ActionLink>
              </div>
            </Reveal>
            <Reveal index={1}>
              <p className="label" style={{ marginBottom: 18 }}>
                Other notes
              </p>
              <div className="ledger">
                {others.map((other) => (
                  <Link
                    className="lrow lrow--action"
                    key={other.slug}
                    href={`/insights/${other.slug}`}
                  >
                    <span>
                      <span className="lrow__key" style={{ display: 'block', marginBottom: 4 }}>
                        {other.title}
                      </span>
                      <span className="lrow__val">{other.kicker}</span>
                    </span>
                    <span className="label label--accent" aria-hidden="true">
                      &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
