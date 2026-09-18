import { RevealLines, Reveal } from '@/components/motion/Reveal';
import { ActionLink } from '@/components/primitives';
import { RecoveryField } from './RecoveryField';
import { HERO } from '@/content/home';
import { CALCULATOR } from '@/content/calculator';
import { CTA } from '@/content/site';

/**
 * The hero.
 *
 * The headline runs the full measure so it can be genuinely large; the
 * supporting copy, both calls to action and the signature panel sit beneath it
 * side by side. Everything is server-rendered markup and readable before a byte
 * of JavaScript executes — there is no introduction to sit through.
 */
export function Hero() {
  return (
    <section className="hero surface--white on-light" aria-labelledby="hero-title">
      <div className="shell">
        <div className="hero__inner">
          <Reveal className="hero__eyebrow" variant="rise">
            <span className="eyebrow">{HERO.eyebrow}</span>
          </Reveal>

          <RevealLines
            as="h1"
            id="hero-title"
            className="display d0 hero__title"
            lines={HERO.titleLines.map((line, i) =>
              i === HERO.titleLines.length - 1 ? <em key={line}>{line}</em> : line
            )}
            startIndex={1}
          />

          <div className="hero__base">
            <div className="hero__copy">
              <Reveal className="hero__lead" as="p" variant="rise" index={4}>
                {HERO.lead}
              </Reveal>

              {/* One action, and nothing under it. The four module chips and
                  their "four modules, one recovery system" note used to close
                  this column: eight words and four secondary controls competing
                  with the one thing the hero is asking for, and the modules are
                  reached from the nav, the losses table and the modules page
                  anyway. The hero now ends on the ask. */}
              {/* The second control is the calculator, and it is the only one
                  that has earned a place back beside the ask: it is a lighter
                  version of the same request, for a reader who is not ready to
                  hand over their details yet. It stays a ghost so the hero
                  still has exactly one primary action. */}
              <Reveal className="hero__actions" variant="rise" index={5}>
                <ActionLink href={CTA.primary.href}>{CTA.primary.longLabel}</ActionLink>
                <ActionLink href={CALCULATOR.entryHref} variant="ghost">
                  {CALCULATOR.entry}
                </ActionLink>
              </Reveal>
            </div>

            <Reveal variant="card" index={3}>
              <RecoveryField />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
