import { Reveal } from '@/components/motion/Reveal';
import type { FaqGroup, FaqItem } from '@/content/faq';

/**
 * Frequently asked questions.
 *
 * Built on `<details>`/`<summary>`, so it is a server component with no state,
 * no client bundle and no dependency on JavaScript: every answer is in the
 * document and reachable with the bundle blocked. The open/close affordance is
 * the site's RESPONSE verb — colour at 180ms, no lift and no shadow.
 *
 * Answers are rendered in full for search engines and for anyone printing the
 * page; `<details>` hides them visually without removing them from the DOM.
 */

function Item({ item, index }: { item: FaqItem; index: number }) {
  return (
    <Reveal as="details" className="faq__item" index={index % 4}>
      <summary className="faq__q">
        <span>{item.q}</span>
        <span className="faq__mark" aria-hidden="true" />
      </summary>
      <div className="faq__a">
        {item.a.map((paragraph) => (
          <p className="small" key={paragraph.slice(0, 24)}>
            {paragraph}
          </p>
        ))}
      </div>
    </Reveal>
  );
}

export function Faq({ groups }: { groups: readonly FaqGroup[] }) {
  return (
    <div className="faq">
      {groups.map((group) => (
        <div className="faq__group" key={group.id}>
          <p className="label faq__grouplabel">{group.label}</p>
          <div className="faq__items">
            {group.items.map((item, i) => (
              <Item item={item} index={i} key={item.q} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** The flat variant, for the shorter sector sets. */
export function FaqList({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="faq">
      <div className="faq__items">
        {items.map((item, i) => (
          <Item item={item} index={i} key={item.q} />
        ))}
      </div>
    </div>
  );
}
