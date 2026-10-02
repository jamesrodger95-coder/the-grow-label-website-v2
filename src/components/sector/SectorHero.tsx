import { Reveal, RevealLines } from '@/components/motion/Reveal';
import { ActionLink } from '@/components/primitives';
import { DayShape } from '@/components/sector/DayShape';
import { ListDepth } from '@/components/sector/ListDepth';
import type { IndustryDefinition } from '@/content/industries';
import { CTA } from '@/content/site';

/**
 * The opening block for a sector page.
 *
 * The two sectors share this shell and nothing else: each brings its own
 * headline, its own six signals and its own visual, because a veterinary group
 * and a dental practice lose money in genuinely different places.
 */
export function SectorHero({ industry }: { industry: IndustryDefinition }) {
  const { hero } = industry;

  return (
    <section className="shero surface--white on-light" aria-labelledby="page-title">
      <div className="shell">
        <div className="shero__meta">
          <span className="label label--accent">{industry.name}</span>
          <span className="small">Revenue recovery</span>
        </div>

        <RevealLines
          as="h1"
          id="page-title"
          className="display d2 shero__title"
          lines={hero.titleLines}
        />

        <div className="shero__body">
          <div className="shero__copy">
            <Reveal as="p" className="lead shero__lead" variant="rise" index={1}>
              {hero.lead}
            </Reveal>

            <Reveal className="shero__actions" variant="rise" index={2}>
              <ActionLink href={CTA.primary.href}>{CTA.primary.longLabel}</ActionLink>
              <ActionLink href="/modules" variant="ghost">
                See the four modules
              </ActionLink>
            </Reveal>

            <Reveal className="shero__signals" variant="rise" index={3}>
              <p className="label shero__signalslabel">What Grow Label looks at</p>
              <ul className="shero__chips">
                {hero.signals.map((signal) => (
                  <li className="shero__chip" key={signal.key} data-kind={signal.kind}>
                    {signal.key}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal className="shero__visual" variant="card" index={2}>
            {hero.visual === 'day' ? (
              <DayShape />
            ) : (
              <ListDepth variant={industry.slug === 'med-spa' ? 'med-spa' : 'dental'} />
            )}
            <p className="micro shero__caption">{hero.visualCaption}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
