import Link from 'next/link';
import { Reveal, RevealLines } from '@/components/motion/Reveal';
import { LEAK_GROUPS, LEAKS_SECTION } from '@/content/home';

/**
 * Where the revenue goes.
 *
 * Six losses, split at the line that actually matters commercially: demand that
 * never became a booking, and bookings that never became attendance. A flat run
 * of six identical rows reads as a list; the split reads as a diagnosis.
 *
 * Each row is a link to the module that works that loss, which is why the
 * hover state is a real affordance rather than decoration — and why keyboard
 * focus lands on it for free.
 */
export function Leaks() {
  return (
    <section className="surface--white on-light section" aria-labelledby="leaks-title">
      <div className="shell">
        <div className="sec-head">
          <div>
            <Reveal variant="rise">
              <span className="eyebrow sec-head__eyebrow">{LEAKS_SECTION.eyebrow}</span>
            </Reveal>
            <RevealLines
              as="h2"
              id="leaks-title"
              className="display d2"
              lines={LEAKS_SECTION.titleLines.map((line, i) =>
                i === 1 ? <em key={line}>{line}</em> : line
              )}
            />
          </div>
          <p className="sec-head__aside">{LEAKS_SECTION.aside}</p>
        </div>

        <Reveal className="lead leaks__lead" as="p" variant="rise">
          {LEAKS_SECTION.lead}
        </Reveal>

        <div className="leaks">
          {LEAK_GROUPS.map((group, groupIndex) => (
            <section className="leakgroup" key={group.id} aria-labelledby={`leaks-${group.id}`}>
              <Reveal className="leakgroup__head" variant="rise" index={groupIndex}>
                <h3 className="leakgroup__title" id={`leaks-${group.id}`}>
                  {group.title}
                </h3>
                <p className="leakgroup__note micro">{group.note}</p>
              </Reveal>

              <div className="leakgroup__rows">
                {group.leaks.map((leak, i) => (
                  <Reveal key={leak.index} index={i} variant="wipe">
                    <Link className="leak" href={leak.href}>
                      {/* The indicator. Always present, so filling it shifts nothing. */}
                      <span className="leak__rail" aria-hidden="true" />
                      <span className="leak__idx">{leak.index}</span>
                      <span className="leak__key">{leak.title}</span>
                      <span className="leak__val">{leak.detail}</span>
                      <span className="leak__tag">
                        {leak.module}
                        <span className="leak__arrow" aria-hidden="true">
                          →
                        </span>
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
