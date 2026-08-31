# CLAUDE.md

Working notes for anyone — human or model — picking this repository up.

## What this is

The Grow Label marketing website. A static-first Next.js App Router site whose
job is to generate qualified requests for a revenue-recovery assessment from
veterinary and dental groups.

It is **not** the Grow Label dashboard. Nothing here connects to the dashboard,
its repository, or its Vercel project.

## Commands

```bash
pnpm dev              # development server
pnpm build            # production build
pnpm start -p 3000    # serve the production build
pnpm quality          # every gate, in the order that fails fastest
pnpm quality --fast   # skip build, e2e and Lighthouse
pnpm quality lint     # run a single named step
```

Individual gates: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`,
`pnpm lighthouse`, `pnpm format`.

`pnpm quality` runs every step even when an earlier one fails, so one run
reports every problem rather than only the first.

## The rules that are not negotiable

These come from the brief and are enforced by tests, not just convention.

1. **Never collapse the four value stages into one figure.** Estimated, booked,
   attended and collected are separate, always, everywhere. `tests/unit/content-integrity.test.ts`
   asserts the stage definitions stay four, ordered, and each carrying a
   confidence basis.
2. **No invented commercial evidence.** No clients, logos, testimonials,
   partners, integrations, case studies, revenue totals, benchmarks, guarantees
   or performance statistics. The same test greps the source for asserted
   claims, and is negation-aware so the pages that exist to _deny_ these claims
   still pass. Anything needing evidence goes in `docs/CLAIMS_REGISTER.md`, not
   on a page.
3. **No clinical claim.** The product reads scheduling and contact data. It does
   not triage, advise, assess or diagnose, and no page may imply otherwise.
4. **Meaningful content is never behind JavaScript.** Every animated element
   renders in its final state by default; motion is opted into after first paint
   by `MotionProvider` setting `data-motion="on"`. A blocked bundle leaves a
   complete, correct page.
5. **Never simulate a successful form submission.** With no delivery provider
   configured the form is switched off and says so.
6. **No Inter, no Poppins** as the display face.

## Architecture

```
src/
  app/           routes; server components unless a file says 'use client'
  components/
    layout/      nav, footer, page header, legal page shell
    motion/      the only client components that exist for motion
    home/        the homepage's own sections and signature visuals
    modules/     the modules index timeline
    sector/      the veterinary and dental signature devices
    contact/     the assessment form
    primitives   design-system primitives, all server-rendered
  content/       every word of published copy, typed
  lib/           env, validation, rate limit, delivery adapter
  styles/        tokens -> base -> components -> sections -> motion
design/          the Claude Design project's source, kept in sync with styles/
```

**Copy lives in `src/content`, not in components.** A route file assembles
sections; it should not contain a sentence a reader will see. This is what makes
the content-integrity test possible.

**Styles are a five-file cascade, in this order.** `tokens.css` holds every
value; `base.css` holds primitives; `components.css` holds the named components
that appear on every route; `sections.css` holds the ones that belong to a
single section or page (the loss rows, the opportunity record, the module
timeline, the two sector visuals, the proof sections); `motion.css` holds the
motion vocabulary. `src/app/globals.css` imports all five and adds only
route-level composition.

Do not add a sixth, and do not add a CSS-in-JS layer. A new named component
goes in `components.css` if more than one route uses it and `sections.css` if
one does.

`design/*.css` are copies of `src/styles/*.css` so the Claude Design artboards
render exactly as production does. After changing a stylesheet, re-copy:

```bash
cp src/styles/tokens.css src/styles/base.css src/styles/components.css src/styles/sections.css design/
```

## Client-component budget

Client components exist only where there is genuine interaction:

- `SiteNav` — drawer state and focus management
- `Reveal` — the single entry point for entrance motion
- `RecoverySequence` — the scroll-driven signature sequence
- `MotionProvider` — enables motion after first paint
- `AssessmentForm` — the form
- the four module scenes, which all share `modules/scene/useScene`

`PointerSignals`, `SignalField` and `Parallax` were removed. The first two were
never mounted anywhere, and parallax was a fifth motion verb used exactly once
with no meaning attached to it.

Adding another needs a reason. In particular, **do not import
`lib/contact-schema` from a client component** — it pulls zod into the browser
bundle. Use `lib/contact-fields`, which has no dependencies.

## Motion

Four verbs, and nothing else:

1. **consolidation** — the signature. Scattered marks migrate onto a grid,
   driven directly by scroll position, never by a trigger. Four placements.
2. **rise** — the one entrance. Opacity plus `--gl-rise` of upward travel.
   `m-card` and `m-wipe` resolve to it; there is no scale-in and no clip-wipe.
3. **draw** — rules and bars grow from their leading edge. Never content.
4. **response** — hover, focus, press, expand, tab-switch. 180ms, colour.
   Never a lift, never a shadow bloom.

One curve (`--gl-ease`) and three durations (180 / 320 / 700ms).
`scripts/motion-inventory.mjs` runs inside `pnpm quality` and fails on any
duration or easing outside that set, so the system is enforced rather than
reviewed. If a proposed effect is not one of the four verbs, it does not ship.

**Scroll-linked scenes** all use `modules/scene/useScene`. It runs one rAF loop
while the element is on screen and reads the element's own rect at paint time;
there is no scroll listener anywhere on the site. Draw callbacks may write
`transform` and `opacity` only, and must never call `setState` per frame. A
scene inside a `position: sticky` parent needs `contain: paint` on the drawing,
or the whole sticky layer repaints on every frame. `docs/MOTION_SYSTEM.md` has
the full inventory; `/dev/motion-lab` is a live harness.

The gotcha that has already bitten once: elements whose CSS keys off
`[data-inview="true"]` must have that attribute on **themselves**, not on a
parent wrapper. `tests/e2e/motion.spec.ts` guards this.

## Environment

Every variable is optional and the site is deployable with none of them.

| Variable                              | Effect when absent                       |
| ------------------------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                | Falls back to the Vercel URL, then local |
| `NEXT_PUBLIC_DASHBOARD_URL`           | "Client sign in" is hidden entirely      |
| `NEXT_PUBLIC_BOOKING_URL`             | "Book a call" is hidden entirely         |
| `CONTACT_WEBHOOK_URL`                 | Form switches to its unconfigured state  |
| `RESEND_API_KEY` + `CONTACT_TO_EMAIL` | As above                                 |

## When changing something visual

Run the capture harness and look at the output. It reports console errors,
failed requests, horizontal overflow, heading-order skips and h1 count across
every route at every breakpoint:

```bash
pnpm build && node scripts/restart.mjs 3112
node scripts/capture.mjs              # all routes, all breakpoints
node scripts/sections.mjs / 1440 1000 artifacts/review   # one route, frame by frame
node scripts/overflow2.mjs /platform 360 800             # what is too wide, and why
node scripts/linkcheck.mjs                               # every internal link and #anchor
node scripts/hover-check.mjs / .leak                     # a hover state that must not reflow
```

`scripts/control-chars.mjs` runs as part of `pnpm quality`. It exists because a
shell heredoc silently turned a regex's `\b` into a literal backspace and its
`\s\d` into the letters `s` and `d`, leaving three assertions that matched
nothing and still reported green. Write source with the file tools, not by
piping text through a shell.

Inline `gridTemplateColumns` on a `.lrow` will silently defeat the responsive
rules through specificity — use the `lrow--pair`, `lrow--pair-action`,
`lrow--action` or `lrow--stage` modifiers instead.
