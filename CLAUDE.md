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
2. **No invented commercial evidence, and exactly one guarded exception.** No
   clients, logos, partners, integrations, revenue totals, benchmarks or
   performance statistics are asserted anywhere. The same test greps the source
   for asserted claims, and is negation-aware so the pages that exist to _deny_
   these claims still pass. Anything needing evidence goes in
   `docs/CLAIMS_REGISTER.md`, not on a page.

   **Two guards were removed at the owner's direction when `/calculator` was
   built, and neither is enforced any more.** The word `guarantee` no longer
   fails the build — the assessment carries one and the report states it — and
   the currency-containment rule below is now a convention rather than a gate.
   The removals are recorded in a header comment in
   `tests/unit/content-integrity.test.ts` and in the claims register. The
   published limitation that no _result_ is guaranteed is unchanged and still
   true; nothing checks it automatically, so check it yourself.

   The exception is `src/content/illustrative.ts`, which holds the fabricated
   results and case studies the site publishes so it can be presented. It is
   safe only while both halves hold, and both are enforced:

   - **Containment.** No _asserted_ currency figure appears in published source
     outside that file or `src/content/testimonials.ts`. Add a number to one of
     those two and import it; never inline one into a component. Both are
     single-purpose, reviewed content files — the rule is that a figure is
     never somewhere nobody reviews, not that only one file may hold one. The
     calculator is the reason this is no longer a test: it prices bands and
     formats a modelled estimate at runtime. It keeps to the intent a different
     way — `lib/calculator/model.ts` derives every label from the same bounds
     the arithmetic uses, so a band cannot say one thing and mean another.
   - **Labelling.** Every surface rendering anything from it also renders
     `ILLUSTRATIVE.tag` / `.caseTag` in a visible `.placeholder-tag`, beside
     the content. The test fails a consumer that imports the fixture without
     rendering a badge.

   Placeholder case-study pages also carry `robots: noindex` and stay out of
   the sitemap. Replace an entry whole — a real figure beside an invented
   quotation is worse than an entirely invented card, because the page no
   longer tells a reader which half is which.

   Two things are **not** covered by this, and both run the guard the other way
   round:

   - **The team** (`TEAM` in `src/content/proof.ts`) is real colleagues, named
     in full. The test fails if a name is missing, is a single word, or holds a
     placeholder string. Portraits are outstanding; drop files into
     `public/team/` and they appear — `Team.tsx` checks the filesystem at build
     time, so there is no flag to set.
   - **Client testimonials** (`src/content/testimonials.ts`) are real, named,
     released clients, including the figures on the video cards. No illustrative
     badge, because nothing about them is illustrative. What the test enforces
     instead: every quotation is attributed to a named person, every figure
     carries its `qualifier` — the window it covers, or the count where the
     client reported one instead — as a separate field, and no copy in that
     file or in `proof.ts` turns a named outcome into an average or an
     expectation. Never attach a window a client did not supply, and never
     carry one across from a figure that has been restated. A signed release
     per person is a prerequisite, tracked in `docs/CLAIMS_REGISTER.md`.

   The homepage case-study section is commented out in `src/app/page.tsx` while
   the studies are placeholders — invented evidence two sections from real
   evidence. `/case-studies` still carries them, labelled and `noindex`.

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
    modules/     the modules index timeline and its header relay
    platform/    the platform page's header device, "the pass"
    sector/      the veterinary and dental signature devices
    contact/     the assessment form
    calculator/  the nine-question flow, its result and the report download
    primitives   design-system primitives, all server-rendered
  content/       every word of published copy, typed
                 illustrative.ts holds the invented figures; testimonials.ts
                 holds the real, released, attributed ones
  lib/           env, validation, rate limit, delivery adapter
    calculator/  the model, the CRM adapter and the PDF report builder
  styles/        tokens -> base -> components -> sections -> motion
public/
  team/          portrait drop-zone
  testimonials/  recordings; the posters beside them are generated
  fonts/         the two static TTFs the PDF report embeds
docs/media/      what to name each media file, and how to encode it
design/          the Claude Design project's source, kept in sync with styles/
```

**Media is dropped in, not wired up.** `Team.tsx` and `VideoTestimonials.tsx`
both check `public/` at build time, so a file that is present is used and one
that is absent falls back to a reserved frame. There is no flag to set. After
adding or replacing a recording run `pnpm posters`, which extracts frame zero
as the poster and remuxes the file to faststart if it needs it — the card uses
`preload="none"`, so without a poster it would start on black. Keep the
READMEs out of `public/`: anything in there is served.

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

## The calculator, and the funnel it feeds

`/calculator` is a lead magnet. Nine questions, and the thing it produces is a
booked call — not a figure on a screen and not a document in somebody's
downloads folder.

**The revenue figure is never shown to the prospect.** It is computed, it is
sent to us, and it is what the call is for. A reader who already has the number
has no reason to turn up, so the completed screen shows exactly two things
instead, both true and both specific to their answers: the front-desk hours
their own answers imply, and the four modules ranked by how much of their
estimate sits in each — the order, never the amounts. `tests/e2e/calculator.spec.ts`
greps the finished screen's markup for anything shaped like a currency figure
and fails if one appears, and `scripts/calculator-walk.mjs` does the same on
every run. Neither is decoration: this is the one property the funnel depends on.

The order of the flow:

1. Nine questions, one per screen. Unchanged.
2. The booking screen: what the call covers, the hours, the module ranking.
3. **The answers POST to `/api/calculator/lead`, and only then** does the
   browser navigate to Cal.com. That order is deliberate — a prospect who
   answers nine questions and abandons the Cal.com page is still a lead, and
   the answers are the whole of what we need. Delivery is best effort: if the
   lead cannot be sent, the reader still reaches the booking page. Nothing
   about our plumbing is worth standing between somebody and a booking.
4. Cal.com redirects to `/assessment-booked`. Set that redirect on the event
   type; the page is `noindex` and out of the sitemap, because a confirmation
   page that ranks is one people arrive at without having done the thing it
   confirms.

`NEXT_PUBLIC_BOOKING_URL` is the Cal.com link. `/calculator` is
`force-dynamic` so setting it takes effect without a redeploy — the same
reason `/contact` is. With it unset the screen says so and routes to
`/contact` rather than offering a button that goes nowhere.

**The model is `src/lib/calculator/model.ts` and its coefficients do not move.**
They are tuned to under-promise: the headline is 60% of what the arithmetic
produces, every figure rounds down, an open-topped band takes its lower bound,
and a "not sure" answer resolves to the practice-type default rather than the
most favourable option. `tests/unit/calculator-model.test.ts` asserts the worked
example's figures literally — raise a coefficient and the build fails rather
than the change passing review. It also asserts the headline stays under 10% of
modelled gross revenue, which is the ratio an owner checks first.

The estimate that reaches the CRM is recomputed on the server from the nine
validated answers rather than accepted from the browser, so a payload edited in
the console produces a corrected figure and not a fabricated one.

### The report

The report is a **team-side artefact**. Nothing on the site builds it and no
prospect is offered it; we build it from their answers and go through it with
them on the call.

```bash
pnpm report artifacts/leads/GL-C-260918-K3F9P.json      # -> artifacts/reports/…pdf
pnpm report <lead.json> out/their-name.pdf
node scripts/pdf-shots.mjs <file.pdf> <outDir>          # to look at it
```

The input is whatever the CRM webhook received — the `LeadPayload` shape in
`src/lib/calculator/crm.ts`. Only `answers` is required; the figures are
recomputed from the same model the site used.

`scripts/report.mjs` imports the TypeScript in `src/` directly. Node strips the
types, `scripts/ts-resolve.mjs` supplies the `@/` alias and the missing file
extensions, and that is the whole build step. It is also why neither
`model.ts` nor `report.ts` may use a constructor parameter property or an enum:
strip-only mode rejects both, and the script is the only consumer that would
notice.

Four things about the document are easy to get wrong again:

- **Assets are injected, not fetched.** `buildReport` takes a `load(path)`
  function. The script reads from `public/`; a browser caller would pass one
  built on `fetch`. Nothing else about the document changes.
- **Tracking is per-glyph.** pdf-lib has no letter-spacing. Joining characters
  with a hair space looks like the cheap fix and is not one: U+200A is outside
  the embedded subset and every gap renders as a .notdef box. `drawTracked`
  places each glyph.
- **Pagination is not optional.** Section length depends on the answers, so
  every long run of rows calls `sheet.ensure(space)`, which returns this page or
  opens the next. Laying a section out on the assumption it fits is how the
  methodology page lost its limits list and printed over its own footer.
- **No tabular figures at display size.** The same trap as `.result__figure`:
  this face gives the comma a full digit advance, so `$287,000` sets as
  `$287 , 000`.

### Reviewing the funnel

```bash
node scripts/calculator-walk.mjs 3112 390 844 artifacts/calculator/mobile
```

Walks all nine questions at a viewport, captures each one and the booking
screen, stubs the Cal.com host, and reports console errors, failed requests,
horizontal overflow, whether the answers were posted before the reader left —
and whether any figure leaked onto the screen.

## Client-component budget

Client components exist only where there is genuine interaction:

- `SiteNav` — drawer state and focus management
- `Reveal` — the single entry point for entrance motion
- `RecoverySequence` — the scroll-driven signature sequence
- `MotionProvider` — enables motion after first paint
- `AssessmentForm` — the form
- `Calculator`, `Result`, `BookCall` — the nine-question flow and the booking
  it ends on
- `Testimonials` — the two rails and their step controls
- `VideoTestimonials` — one piece of state per card: playing or not
- the four module scenes, which all share `modules/scene/useScene`

`PointerSignals`, `SignalField` and `Parallax` were removed. The first two were
never mounted anywhere, and parallax was a fifth motion verb used exactly once
with no meaning attached to it.

`Team` used to be a client component too. It opened a modal carrying a
two-paragraph remit per person, which cost a portal and a focus trap for
content nobody had asked to read; the remit is now one line on the card and the
section is server-rendered. `Modal` survives for nothing on the homepage — check
before assuming it still earns its place.

Adding another needs a reason. In particular, **do not import
`lib/contact-schema` from a client component** — it pulls zod into the browser
bundle. Use `lib/contact-fields`, which has no dependencies.

The FAQ is the worked example of the alternative: `components/layout/Faq.tsx` is
a server component built on `<details>`/`<summary>`, so every answer is in the
document with the bundle blocked and it costs nothing to hydrate.

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
| `NEXT_PUBLIC_BOOKING_URL`             | The Cal.com link. Without it the         |
|                                       | calculator routes to /contact instead    |
| `CONTACT_WEBHOOK_URL`                 | Form switches to its unconfigured state  |
| `RESEND_API_KEY` + `CONTACT_TO_EMAIL` | As above                                 |
| `CALCULATOR_CRM_URL`                  | Falls back to `CONTACT_WEBHOOK_URL`      |
| `CALCULATOR_CRM_TOKEN`                | Sent as a bearer token when present      |

With neither `CALCULATOR_CRM_URL` nor `CONTACT_WEBHOOK_URL` set, a completed
questionnaire reaches nobody. The reader still gets to the booking page — the
lead POST is best effort and never blocks it — but the answers are gone, and
with them the assessment. **This is the one variable the funnel does not work
without.**

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
