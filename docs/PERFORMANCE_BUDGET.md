# Performance budget

Run with `pnpm lighthouse`, or as part of `pnpm quality`.

## Method

Lighthouse's default **mobile** configuration, which is the one that binds:
390×844 at DPR 2.625, simulated throttling at 1638 kbps with a 562.5ms
per-request latency and a 4× CPU slowdown. Audits run against a production
build, on a Chromium instance the runner launches itself.

The runner is `scripts/lighthouse.mjs` rather than `lhci`. Lighthouse CI's
`chrome-launcher` races its own temp-profile cleanup on Windows and exits
non-zero **after** a successful audit, which meant assertions never ran.

## Gates — a regression here fails the build

| Gate                    | Budget   | Worst measured |
| ----------------------- | -------- | -------------- |
| Performance (mobile)    | ≥ 90     | **96**         |
| Accessibility           | ≥ 95     | **100**        |
| Best practices          | ≥ 95     | **100**        |
| SEO                     | ≥ 95     | **100**        |
| Cumulative layout shift | ≤ 0.1    | **0**          |
| Total blocking time     | ≤ 400ms  | **58ms**       |
| Initial transfer        | ≤ 1.2 MB | **311 KB**     |
| Initial JavaScript      | ≤ 180 KB | **149 KB**     |

## Measurements

Mobile, simulated slow 4G, production build:

| Route                    | Perf | A11y | BP  | SEO | LCP    | CLS | TBT  | Transfer | JS     |
| ------------------------ | ---- | ---- | --- | --- | ------ | --- | ---- | -------- | ------ |
| `/`                      | 96   | 100  | 100 | 100 | 2688ms | 0   | 57ms | 311 KB   | 149 KB |
| `/platform`              | 97   | 100  | 100 | 100 | 2521ms | 0   | 58ms | 260 KB   | 149 KB |
| `/modules/answer`        | 97   | 100  | 100 | 100 | 2516ms | 0   | 54ms | 295 KB   | 149 KB |
| `/industries/veterinary` | 97   | 100  | 100 | 100 | 2510ms | 0   | 45ms | 258 KB   | 149 KB |
| `/methodology`           | 97   | 100  | 100 | 100 | 2513ms | 0   | 51ms | 259 KB   | 149 KB |
| `/contact`               | 97   | 100  | 100 | 100 | 2520ms | 0   | 56ms | 258 KB   | 151 KB |

Raw reports are written to `artifacts/lighthouse/`.

## LCP: tracked, not gated

**Target 2500ms. Measured 2510–2688ms.** This is the one stated target the site
does not clear, and it is recorded here rather than quietly relaxed.

The LCP element is the hero standfirst, set in Archivo. Under Lighthouse's
simulated mobile throttling every request carries a 562.5ms latency, so a
self-hosted webfont sits two round trips behind the document: document →
preload → paint. That floor is roughly 1.9s before any bytes are counted, and it
puts a font-led page at ~2.5s regardless of how the fonts are configured.

Four approaches were implemented, measured and reverted because each moved LCP
by less than the run-to-run variance (±150ms):

| Attempt                                      | Result                                                                                            |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Drop the Archivo preload                     | LCP **worse** by ~150ms — it is on the LCP path                                                   |
| `font-display: optional` on Archivo          | No change; the swap is not what defers the metric                                                 |
| `experimental.inlineCss`                     | No change; a larger document offset the round trip saved. Also cost /contact 9 performance points |
| Split the serif italic off the critical path | No change, and introduced CLS 0.031 as it swapped in                                              |

What would actually move it: dropping a typeface, or accepting a first visit
rendered in Arial. Both trade the brand's central asset for a synthetic metric,
and neither is worth it for a site whose argument is carried by its typography.

Field LCP on a typical connection will be materially lower. The gates that do
bind — the performance score itself, CLS, TBT and payload — are met with room.

## Deliberate cost decisions

| Decision                     | Cost                 | Why                                                                    |
| ---------------------------- | -------------------- | ---------------------------------------------------------------------- |
| Three typefaces, four files  | ~78 KB               | The typography is the identity. Weights are rationed to what is used.  |
| No animation library         | −60 KB or more       | Nothing in the finished design needed one                              |
| No UI or CSS framework       | −40 KB or more       | The design system is the product; a framework would dictate part of it |
| Server components by default | —                    | Six client components exist site-wide, each for real interaction       |
| zod on the server only       | −86 KB on `/contact` | The form needed option lists, not a validator                          |
| Static rendering             | —                    | Only `/contact` and `/api/contact` are dynamic                         |

## Front-loaded protections

- **CLS is 0** because nothing animates a layout property. Motion is limited to
  `transform`, `opacity`, `clip-path` and SVG geometry, and all figures are
  tabular so a number never reflows as it changes.
- **TBT stays under 60ms** because the hero ships no JavaScript on the critical
  path: the signal field is server-rendered with a CSS-only entrance.
- **No third-party requests at all.** No analytics, tag manager, chat widget,
  font CDN, embedded video or social script. Fonts are self-hosted through
  `next/font`.
- **No images.** Every graphic is inline SVG or CSS, so there is no image
  weight, no layout shift from late-loading media, and nothing to lazy-load.

## Watching for regressions

The two failure modes most likely to creep back:

1. **A client component importing a server module.** The `/contact` route once
   shipped zod because the form imported the schema for its option lists. If a
   route's JS jumps by tens of kilobytes, check what a `'use client'` file is
   importing.
2. **A new dependency.** There is no animation, UI or CSS library here by
   design. Adding one needs a reason that survives this table.
