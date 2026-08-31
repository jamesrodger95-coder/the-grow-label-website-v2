import Link from 'next/link';
import { RevealLines, Reveal } from '@/components/motion/Reveal';
import { ActionLink } from '@/components/primitives';
import { RecoveryField } from './RecoveryField';
import { HERO } from '@/content/home';
import { MODULES } from '@/content/modules';
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

              {/* One action. The route to how value is measured is carried by
                  the value-stages section, the closing band and the platform
                  page; a second button here only competed with the first. */}
              <Reveal className="hero__actions" variant="rise" index={5}>
                <ActionLink href={CTA.primary.href}>{CTA.primary.longLabel}</ActionLink>
              </Reveal>

              <Reveal className="hero__modules" variant="rise" index={6}>
                {MODULES.map((m) => (
                  <Link className="modbtn" key={m.slug} href={`/modules/${m.slug}`}>
                    {m.name}
                  </Link>
                ))}
                <span className="hero__note">{HERO.modulesNote}</span>
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
