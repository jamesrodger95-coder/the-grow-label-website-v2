import Image from 'next/image';

/**
 * The Grow Label lockup: the mark and the wordmark.
 *
 * One component, so the logo exists in exactly one place. It was previously
 * hand-drawn as an inline SVG in the nav, copy-pasted into the footer, drawn
 * again in the favicon and rebuilt out of divs in the social card — four copies
 * that had to be kept in step by hand.
 *
 * The artwork carries a near-black outline, which survives a light ground and
 * disappears into the black footer. `tone="light"` swaps in the variant whose
 * outline has been lifted to the warm white; both are generated from the single
 * supplied file by `scripts/logo-variants.mjs`.
 *
 * `next/image` rather than a bare `<img>`: the mark sits in the nav on every
 * route, so serving it as AVIF or WebP instead of the 62KB source PNG is worth
 * the optimiser. Width and height are fixed, so the bar cannot reflow while it
 * loads, and it is marked decorative because the wordmark beside it already
 * carries the name.
 */

/** The trimmed artwork's intrinsic aspect, and the height it renders at. */
const MARK = { width: 630, height: 726 };
const HEIGHT = 22;
const WIDTH = Math.round((MARK.width / MARK.height) * HEIGHT);

export function Logo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    <>
      <Image
        className="logo__mark"
        src={tone === 'light' ? '/logo-mark-light.png' : '/logo-mark.png'}
        alt=""
        width={WIDTH}
        height={HEIGHT}
        priority
      />
      <span className="logo__word">Grow Label</span>
    </>
  );
}
