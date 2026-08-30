# Build state

Maintained so another session can resume accurately. Last updated at the point
the Vercel preview was created.

## Status: complete and deployed to preview

| Phase                                        | State |
| -------------------------------------------- | ----- |
| Research and reference analysis              | Done  |
| Claude Design project and design system      | Done  |
| Design synchronised into the codebase        | Done  |
| Application scaffold                         | Done  |
| All sixteen routes                           | Done  |
| Motion system                                | Done  |
| Contact journey and delivery adapter         | Done  |
| Unit, component, e2e and accessibility tests | Done  |
| Three visual quality passes                  | Done  |
| Performance work and budgets                 | Done  |
| Documentation                                | Done  |
| Code review and fixes                        | Done  |
| GitHub repository, branch, pull request      | Done  |
| Vercel preview deployment and verification   | Done  |

## Environment

- Repository: `the-grow-label-website-v2` (private)
- Branch: `feat/complete-claude-build`, branched from `main`
- Vercel project: `the-grow-label-website-v2` — preview at https://the-grow-label-website-v2-53068s7cn.vercel.app
- Pull request: https://github.com/jamesrodger95-coder/the-grow-label-website-v2/pull/1 (open, not merged)
- Node 24, pnpm 11, Next.js 16.3.3, React 19.2.8, TypeScript 5.9.3

## Design source

Claude Design project **Grow Label Website V2** contains:

| File          | Contents                                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| `index.html`  | Visual thesis, colour, typography, grid, components, motion                                                |
| `home.html`   | Desktop homepage, mobile homepage, mobile drawer                                                           |
| `pages.html`  | Route system, page header, module template, industries, methodology, contact, footer, responsive behaviour |
| `motion.html` | Frame-by-frame storyboard and the full motion inventory                                                    |
| `tokens.css`  | The token file this application ships                                                                      |
| `styles.css`  | Base, components and artboard chrome                                                                       |

`design/*.css` in this repository are copies of `src/styles/*.css`. After
changing a stylesheet:

```bash
cp src/styles/tokens.css src/styles/base.css src/styles/components.css design/
```

## Routes

All sixteen build and are covered by the smoke, accessibility, responsive and
motion suites.

| Route                       | Rendering | Notes                                   |
| --------------------------- | --------- | --------------------------------------- |
| `/`                         | Static    | Eight beats, signature scroll sequence  |
| `/platform`                 | Static    | Five sections                           |
| `/modules/[module]` ×4      | SSG       | Nine-part template, module rail         |
| `/industries/[industry]` ×2 | SSG       | Distinct signature devices per sector   |
| `/methodology`              | Static    | Four stages, six terms, five limits     |
| `/about`                    | Static    | Position, principles, audience          |
| `/insights`                 | Static    | Ruled index                             |
| `/insights/[slug]` ×3       | SSG       | Long-form notes                         |
| `/contact`                  | Dynamic   | Reads delivery configuration at request |
| `/privacy`, `/terms`        | Static    | Shared legal shell                      |
| `/dev/styleguide`           | Static    | `noindex`, not linked from navigation   |
| `/dev/motion-lab`           | Static    | `noindex`, not linked from navigation   |
| `/api/contact`              | Dynamic   | POST submits, GET reports configuration |

## Test results

| Suite               | Count | Result |
| ------------------- | ----- | ------ |
| Unit and component  | 57    | Pass   |
| Playwright, total   | 69    | Pass   |
| — smoke             | 21    | Pass   |
| — accessibility/axe | 21    | Pass   |
| — responsive        | 9     | Pass   |
| — motion            | 4     | Pass   |
| — reduced motion    | 5     | Pass   |
| — contact           | 8     | Pass   |

Lighthouse, mobile: performance 96–97, accessibility 100, best practices 100,
SEO 100, CLS 0, initial JS 149 KB. See
[PERFORMANCE_BUDGET.md](PERFORMANCE_BUDGET.md) for the LCP position.

## Decisions worth not re-litigating

| Decision                                   | Reason                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------------ |
| No animation library                       | Nothing in the finished design needed one; the signature sequence is ~40 lines |
| No UI or CSS framework                     | The design system is the deliverable                                           |
| Copy lives in `src/content`                | Makes the content-integrity test possible and copy reviewable alone            |
| zod is server-only                         | It was costing `/contact` 86 KB of client bundle                               |
| Custom Lighthouse runner instead of `lhci` | chrome-launcher exits non-zero after a successful audit on Windows             |
| LCP tracked rather than gated              | Structurally bounded by simulated latency; four fixes measured and reverted    |
| Ledger rows use modifier classes           | Inline `gridTemplateColumns` defeats the responsive rules on specificity       |

## Things that bit, and are now guarded

1. **Stage bars invisible with motion on.** The observer was on a wrapper, so
   `.stagebar[data-inview="true"]` never matched and the fills sat at
   `scaleX(0)`. The reduced-motion suite missed it because that path resets the
   transform. Guarded by `tests/e2e/motion.spec.ts`.
2. **Footer CSS silently absent.** A failed heredoc write dropped the footer
   block; the footer rendered as one unstyled column for several commits before
   a screenshot caught it. Always look at the screenshots.
3. **Inline grid overrides.** Several `.lrow` instances carried inline
   `gridTemplateColumns`, which won on specificity and broke the mobile rules.
   Replaced with modifier classes.
4. **Decorative ordinals in accessible names.** Drawer links read as "Dental 07"
   until the ordinal was marked `aria-hidden`.
5. **`module` as a variable name.** Shadows the CommonJS global; `@next/next`
   lints it.

## Not done, and why

| Item                                     | Reason                                                                                             |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Production deployment                    | Explicitly out of scope                                                                            |
| Production domain                        | Explicitly out of scope                                                                            |
| Merging the pull request                 | Explicitly out of scope                                                                            |
| Any dashboard connection                 | Explicitly out of scope; `NEXT_PUBLIC_DASHBOARD_URL` is unset and the affected links do not render |
| Client logos, testimonials, case studies | No evidence exists. See [CLAIMS_REGISTER.md](CLAIMS_REGISTER.md)                                   |
| Company registration and legal details   | Facts not available to this session; flagged on the pages themselves                               |
| Analytics                                | Not requested, and `/privacy` currently states there are none                                      |
| A live delivery provider                 | No credentials supplied; the form renders its unconfigured state                                   |

## Resuming

```bash
pnpm install
pnpm quality --fast          # format, lint, types, unit tests
pnpm build && pnpm quality   # everything, including e2e and Lighthouse
```

Before changing anything visual, read the "When changing something visual"
section of [CLAUDE.md](../CLAUDE.md) — the capture and overflow harnesses will
find layout regressions faster than reading CSS will.
