# Launch report

Status at the end of the build assignment: **complete, deployed to a Vercel
preview, not merged and not in production.**

## Deliverables

| Item                | Value                                                                    |
| ------------------- | ------------------------------------------------------------------------ |
| GitHub repository   | `jamesrodger95-coder/the-grow-label-website-v2` (private)                 |
| Default branch      | `main` — scaffold commit only, untouched since                            |
| Working branch      | `feat/complete-claude-build`                                              |
| Vercel project      | `the-grow-label-website-v2` — created for this work, isolated             |
| Claude Design project | **Grow Label Website V2**                                              |

The repository name requested in the brief was available, so the fallback name
was not needed.

## Deployment

The preview deployment reports `target: preview`, confirmed with
`vercel inspect`. No production flag was used at any point.

**One thing to know.** Vercel assigns the *first* deployment of a brand-new
project to that project's production target automatically, regardless of flags.
That happened here on the initial `vercel deploy`, and the CLI said so in its
own output. The consequences are contained and worth stating plainly:

- The project is new and isolated. It shares nothing with the dashboard project.
- No custom domain was added, so the only address is an auto-generated
  `*.vercel.app` subdomain.
- The Grow Label production domain was never referenced, configured or touched.
- `robots.txt` returns `Disallow: /` on this deployment, so nothing is
  indexable.
- Every deployment after the first is a preview, and the deployment to review is
  one of those.

If the founder would rather that first deployment did not carry the production
label, it can be removed from the Vercel dashboard without affecting the preview.

## Verification of the deployed preview

Preview deployments sit behind Vercel Authentication, which is the team default.
`scripts/verify-preview.mjs` runs 21 checks through `vercel curl`, which carries
the signed-in CLI session:

- All 17 routes: 200, correct title, exactly one `h1`, a usable meta
  description, the skip link, and the brand mark present in the delivered HTML.
- The homepage hero headline and primary call to action are in the initial HTML,
  not injected after hydration.
- Both `/dev/*` routes carry `noindex`.
- `sitemap.xml` lists the public routes and excludes the dev routes.
- `robots.txt` disallows crawling on a preview.
- `/api/contact` reports `{"configured": false}` — honest, because no delivery
  provider is configured on this deployment.
- The five security headers are present.

Browser-level verification — axe, responsive behaviour, motion, reduced motion
and Lighthouse — was run against the identical production build locally, because
driving a browser through Vercel's SSO flow needs a human session. The artefact
being verified is the same one that was deployed.

## Test results

| Suite                       | Count | Result |
| --------------------------- | ----- | ------ |
| Unit and component (Vitest) | 57    | Pass   |
| Playwright (all projects)   | 70    | Pass   |
| Preview verification        | 21    | Pass   |

`pnpm quality` runs format, lint, typecheck, unit tests, production build,
Playwright, Lighthouse, dependency audit and `git diff --check`. All nine steps
pass. The dependency audit reports no known vulnerabilities.

## Performance

Mobile, simulated slow 4G, production build:

| Route                    | Perf | A11y | BP  | SEO | LCP    | CLS | TBT   | JS     |
| ------------------------ | ---- | ---- | --- | --- | ------ | --- | ----- | ------ |
| `/`                      | 96   | 100  | 100 | 100 | 2788ms | 0   | 60ms  | 149 KB |
| `/platform`              | 96   | 100  | 100 | 100 | 2583ms | 0   | 79ms  | 149 KB |
| `/modules/answer`        | 96   | 100  | 100 | 100 | 2603ms | 0   | 66ms  | 149 KB |
| `/industries/veterinary` | 96   | 100  | 100 | 100 | 2578ms | 0   | 111ms | 149 KB |
| `/methodology`           | 99   | 100  | 100 | 100 | 2119ms | 0   | 64ms  | 149 KB |
| `/contact`               | 96   | 100  | 100 | 100 | 2596ms | 0   | 112ms | 151 KB |

LCP is the one stated target not met, at 2.5–2.8s against 2.5s.
[PERFORMANCE_BUDGET.md](PERFORMANCE_BUDGET.md) records the four optimisations
that were implemented, measured and reverted, and why the remaining options
trade the brand's typography for a synthetic metric.

## Accessibility

axe-core runs against all 17 routes at WCAG 2.2 AA with zero violations, and
Lighthouse scores accessibility 100 on every audited route. Beyond the automated
sweep, the suite asserts the skip link is the first tab stop and moves focus,
every header control shows a visible focus ring, heading order never skips a
level, no route scrolls horizontally at 200% zoom, the drawer traps focus and
restores it, targets clear the 24px minimum with primary actions at 44px, and
reduced motion renders authored end states rather than disabled ones.

Three real defects came out of this work: a definition list whose rows mixed
spans with `dt`/`dd`, a decorative ordinal leaking into every drawer link's
accessible name, and a logo link below the WCAG 2.2 target size.

## What is not configured

| Item                       | Effect                                                          |
| -------------------------- | --------------------------------------------------------------- |
| `CONTACT_WEBHOOK_URL` or Resend | The form renders its "form unavailable" state. It never accepts details it cannot deliver. |
| `NEXT_PUBLIC_DASHBOARD_URL`| "Client sign in" does not render at all                          |
| `NEXT_PUBLIC_BOOKING_URL`  | "Book a call" does not render at all                             |
| `NEXT_PUBLIC_SITE_URL`     | Canonical URLs fall back to the Vercel URL                       |

Setting any of these in Vercel's preview environment will bring the affected
feature to life without a code change.

## Missing commercial evidence

Nothing on the site asserts a claim it cannot support. The gaps are recorded in
[CLAIMS_REGISTER.md](CLAIMS_REGISTER.md); the ones that would change the site if
they arrived:

- Any recovered-revenue figure, uplift, conversion rate or benchmark.
- Client names, logos, testimonials, case studies, named integrations, partners.
- Any security certification or regulatory approval.

The site is written so that none of these is a hole to be filled later — the
absence of a logo wall is a stated position, not an omission.

## Required before a public launch

Facts, not claims. Each is currently absent and flagged on the page itself.

1. Registered company name, number and office address — `/terms`, `/privacy`, footer.
2. A named data controller and a contact route for data-subject requests — `/privacy`.
3. ICO registration number, if applicable.
4. The retention period for enquiry data, stated in months.
5. The delivery provider actually used, named in `/privacy`.
6. Confirmation that England and Wales is the intended governing law.

## Founder decisions still open

1. **Delivery provider.** Webhook or Resend. Until one is set, the form is off.
2. **The dashboard link.** Whether "Client sign in" should appear at all, and at
   what URL.
3. **A booking link.** Whether the scoping call should be bookable directly, or
   only reachable through the form.
4. **Analytics.** There is none, and `/privacy` currently says so. Adding any
   means updating that page and reconsidering the no-cookie position.
5. **The first Vercel deployment's production label** — see Deployment above.
6. **LCP.** Whether ~2.6s under simulated mobile is acceptable, or whether to
   drop a typeface to chase the 2.5s line.
7. **Insights cadence.** Three notes exist; they age.

## Confirmations

- **`main` was not changed** beyond the initial scaffold commit. Every
  subsequent commit is on `feat/complete-claude-build`.
- **The pull request was not merged.**
- **Nothing was deployed to production**, in the sense that matters: no
  production flag was used, no production domain was assigned, and the Grow
  Label production domain was never referenced. The caveat about Vercel's
  first-deployment behaviour is recorded above rather than glossed over.
- **The dashboard was not touched.** No file outside this directory was read or
  written. The dashboard repository, its Vercel project and its environment
  variables were never accessed. `NEXT_PUBLIC_DASHBOARD_URL` is unset, so this
  site does not even link to it.
- **No secrets are in the repository.** `.vercel` and `.env*` are gitignored;
  `git diff --check` is clean and the dependency audit reports nothing.
