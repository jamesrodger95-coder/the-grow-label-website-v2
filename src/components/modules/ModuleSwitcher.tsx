import Link from 'next/link';
import { MODULES, type ModuleSlug } from '@/content/modules';

/**
 * The switcher at the foot of every module page.
 *
 * Four routes that share a structure, so switching between them should behave
 * like changing tabs rather than like leaving a page. Two things do that:
 *
 *   `scroll={false}` keeps the reader where they are. The switcher sits in the
 *   same place on all four pages, so preserving the offset means the control
 *   they just used is still under their cursor afterwards. The default, which
 *   is to jump to the top, would throw them back through a page they had just
 *   finished reading.
 *
 *   The cross-fade is the site's view transition, declared once in motion.css
 *   as a 200ms opacity change on the root. It is opacity only and it never
 *   delays the navigation, so a slow connection degrades to a plain page
 *   change rather than to a stall.
 */
export function ModuleSwitcher({ current }: { current: ModuleSlug }) {
  return (
    <nav className="mswitch" aria-label="Modules">
      <p className="mswitch__label label">The four modules</p>
      <ul className="mswitch__list">
        {MODULES.map((module) => {
          const isCurrent = module.slug === current;
          return (
            <li key={module.slug}>
              <Link
                className="mswitch__item modbtn"
                href={`/modules/${module.slug}`}
                aria-current={isCurrent ? 'page' : undefined}
                scroll={false}
              >
                <span className="mswitch__num" aria-hidden="true">{`0${module.index}`}</span>
                <span className="mswitch__name">{module.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mswitch__note micro">
        Each one works a different point in the same system. They are configured together and
        reported together.
      </p>
    </nav>
  );
}
