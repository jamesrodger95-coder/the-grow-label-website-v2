# Motion system

Source of truth: `src/styles/motion.css` and `src/components/motion/*`.
Live harness: `/dev/motion-lab`.

## The rule

**Three verbs, and nothing else.** Every animation on this site is one of them,
and each one restates the product argument. If a proposed effect is not one of
the three, it does not ship.

| Verb            | What it means                              | What it argues                            |
| --------------- | ------------------------------------------ | ----------------------------------------- |
| **Detect**      | Content appears where it already is        | The signals already exist in your systems |
| **Consolidate** | Scattered marks migrate onto a shared grid | Unstructured events become a worked queue |
| **Settle**      | Bars step out into their final proportions | Value moves stage by stage, on evidence   |

## The contract

Every animated element **renders in its final state by default**. The animated
start state is applied only once `MotionProvider` has set `data-motion="on"` on
the root, one frame after first paint.

That ordering is the whole safety story:

- Meaningful content never waits on JavaScript.
- A blocked, failed or slow bundle leaves a complete, correct page.
- Search engines and text-mode readers see finished content.
- Motion is enabled only where `IntersectionObserver` exists, because that is
  what moves an element from its start state to its end state. Without it the
  page simply keeps the authored final state rather than animating to nothing.

### A reveal must never clip the element it observes

An element clipped to `inset(0 100% 0 0)` has zero rendered width, so
IntersectionObserver reports no intersection and the callback that would
un-clip it never fires. The reveal waits forever on itself.

Every ledger row and step list on the site was invisible because of this. The
fix is structural, not a tuning value: `Reveal variant="wipe"` wraps its
children in `.m-wipe__inner` and clips **that**, leaving the observed element
at full size. Nothing else in the vocabulary may clip its own observed node.

### The failure this contract has already caught

An element whose CSS keys off `[data-inview="true"]` must carry that attribute
**itself**. The four-stage bar had its observer on a parent wrapper, so with
motion enabled the fills stayed at `scaleX(0)` and every bar on the site
rendered empty. The reduced-motion suite missed it because that path resets the
transform. `tests/e2e/motion.spec.ts` now asserts the fills reach a visible,
descending width with animation on.

## Inventory

| ID  | What                       | Verb        | Implementation                                                                                                                                                                  |
| --- | -------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M01 | Recovery field             | Detect      | The hero signature. Pure CSS: a 14x8 tick grid whose columns carry `animation-delay`, a sweep gradient crossing it, four stage bars filling behind. No JS on the critical path. |
| M02 | Headline lines             | Detect      | `RevealLines` — each line its own `overflow:hidden` mask, rising 106%, 85ms stagger. Line breaks are authored, never measured.                                                  |
| M03 | Rise                       | Detect      | The workhorse for prose and controls. 14px, opacity, 60ms stagger.                                                                                                              |
| M04 | Card settle                | Settle      | Panels arrive at `scale(.985)` and settle, so they read as objects rather than text.                                                                                            |
| M05 | Wipe                       | Detect      | Ledger rows and step lists revealed by a left-to-right `clip-path`, 55ms stagger. The clip is on an inner span — see below.                                                     |
| M06 | Rule draw                  | Detect      | `scaleX` from the leading edge as a hairline enters.                                                                                                                            |
| M07 | Pinned value scene         | All three   | A sticky stage over a 170vh spacer; scroll progress promotes one of four stages. No pin library, no scroll hijack.                                                              |
| M08 | Stage bar growth           | Settle      | `scaleX` from the left, 130ms stagger, ease-settle.                                                                                                                             |
| M09 | Parallax                   | Settle      | rAF-throttled, IntersectionObserver-gated, desktop-only. Writes `--py`; transform only, so it stays on the compositor.                                                          |
| M10 | Opposing testimonial rails | Consolidate | Two CSS marquees running in opposite directions, paused on hover, focus and by the pause control. Collapses to a swipeable track on mobile and under reduced motion.            |
| M11 | Marquee strip              | Detect      | A single slow reading rail under the hero. Duplicated content, `translate3d`, pauses on hover.                                                                                  |
| M12 | Card hover                 | Settle      | Case studies, video cards and profiles lift on a fine pointer only, with the media scaling inside a fixed frame.                                                                |
| M13 | Nav condense               | Settle      | The floating pill tightens its padding and deepens its shadow past the hero.                                                                                                    |
| M14 | Control wipe               | Settle      | `scaleX` pseudo-element; fires on hover **and** `:focus-visible`.                                                                                                               |
| M15 | Drawer / modal             | Settle      | Panel fade plus staggered links; focus trapped, Escape closes, scroll locked.                                                                                                   |
| M16 | Route transition           | Settle      | 200ms view transition; never delays navigation or the LCP element.                                                                                                              |

## The signature sequence

One sequence on the homepage. A single set of eight marks transforms through
four states as the reader scrolls a tall section:

1. **Detect** — marks fade in where they fell: scattered, unaligned, faint.
2. **Consolidate** — every mark translates onto one column and equalises.
3. **Settle** — the column resolves into the labelled four-stage staircase.
4. **Hold** — a dashed rule drops from the collected bar: _money in the account_.

It is the same eight SVG rects throughout, animated on `x`, `y`, `width`,
`height`, `opacity` and `fill`. Nothing crossfades between separate graphics,
because the argument is that these are the _same events_ at four stages of
resolution.

### Why there is no pinning library

Native scrolling is untouched. The section is simply tall, the stage is
`position: sticky`, and a rAF-throttled scroll read maps the section's position
to a state index. The listener is attached only while the section is on screen
and removed when it leaves.

That is roughly forty lines of code instead of a scroll-hijacking dependency,
and it cannot break the reader's scrollbar, keyboard paging or browser find.

## Budget

No animation library, at all. GSAP, ScrollTrigger, Lenis, Motion, WebGL and
autoplay video were all available and all declined: nothing in the finished
design needed them, and each would have cost more than the effect was worth
against the mobile budget.

What is used instead:

- CSS transitions and keyframes driven by custom properties
- `IntersectionObserver`, one-shot, disconnected as soon as an element is seen
- One rAF-throttled scroll listener, attached only while its section is visible
- `ResizeObserver` for layout changes, never a window resize listener
- `useSyncExternalStore` for the reduced-motion media query, so there is no
  synchronous state update on mount and no extra render pass

Animated properties are `transform`, `opacity`, `clip-path` and SVG geometry
only. `will-change` is set during a transition and released after it.

## Reduced motion

Every sequence has an **authored final state**, not a disabled one.

Under `prefers-reduced-motion: reduce`:

- Duration tokens collapse to 1ms at the token layer, so no component needs its
  own branch.
- The recovery sequence renders frame four — the completed staircase with its
  labels and marker — immediately, and does not respond to scroll.
- The hero's signal marks are present at their authored strength with no drift
  and no delay.
- Cursor proximity never attaches.
- Sticky asides become static, because unexpected movement is unwelcome even
  when it is not technically animation.
- View transitions are switched off.

`tests/e2e/reduced-motion.spec.ts` runs the whole route list under emulated
reduced motion and asserts nothing is left faded, the sequence shows its final
state, and the stage bars are drawn at full width.

## Never

- No compulsory intro, loader or splash.
- No scroll hijacking, scroll smoothing or scroll-position stealing.
- No animation that changes layout size, so no animation-induced layout shift.
  Measured CLS is 0 across every audited route.
- No motion above the fold before the hero text has painted.
- No information carried only by movement.
- No effect that keeps running outside the viewport.
