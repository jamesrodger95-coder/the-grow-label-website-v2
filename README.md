# Grow Label — website

Marketing website for Grow Label, a revenue-recovery and revenue-operations
platform for veterinary and dental organisations.

Its single conversion objective is a qualified request for a revenue-recovery
assessment.

## Quick start

```bash
pnpm install
pnpm dev
```

The site runs with no environment configuration at all. Optional variables are
listed under [Configuration](#configuration); when one is absent the affected
action is hidden or adapted rather than shown broken.

## Stack

| Concern     | Choice                                                        |
| ----------- | ------------------------------------------------------------- |
| Framework   | Next.js 16, App Router, React Server Components by default    |
| Language    | TypeScript, strict, with `noUncheckedIndexedAccess`           |
| Styling     | Hand-authored CSS over a central token file. No UI framework. |
| Motion      | No animation library. IntersectionObserver + CSS transitions. |
| Fonts       | `next/font` — Instrument Serif, Archivo, IBM Plex Mono        |
| Validation  | zod, server-side only                                         |
| Unit tests  | Vitest + Testing Library                                      |
| E2E / a11y  | Playwright + axe-core                                         |
| Performance | Lighthouse, driven through a Playwright-managed Chromium      |

There is no component framework, no CSS framework, and no animation library.
The visual identity is the product here; a dependency that dictates part of it
would be working against the brief.

## Routes

| Route                    | What it is                                        |
| ------------------------ | ------------------------------------------------- |
| `/`                      | The commercial narrative, in eight numbered beats |
| `/platform`              | Architecture, controls and the data boundary      |
| `/modules/answer`        | Calls that would otherwise go unanswered          |
| `/modules/respond`       | First response on written enquiries               |
| `/modules/retain`        | Protecting a schedule that is already filled      |
| `/modules/reactivate`    | Working the back book                             |
| `/industries/veterinary` | Seven veterinary workflows, multi-site comparison |
| `/industries/dental`     | Seven dental workflows, the recall interval rail  |
| `/methodology`           | The four value stages and the limits of the claim |
| `/about`                 | Position, operating principles, audience          |
| `/insights`              | Notes on measurement and revenue operations       |
| `/insights/[slug]`       | An individual note                                |
| `/contact`               | The assessment request journey                    |
| `/privacy`, `/terms`     | Legal                                             |
| `/dev/styleguide`        | Live token and component inventory (not indexed)  |
| `/dev/motion-lab`        | Isolated motion harness (not indexed)             |

## Scripts

```bash
pnpm dev            # development server
pnpm build          # production build
pnpm start          # serve the production build
pnpm quality        # format, lint, types, tests, build, e2e, Lighthouse, audit
pnpm quality --fast # the quick half of the above
pnpm test           # unit and component tests
pnpm test:e2e       # Playwright, including axe and reduced motion
pnpm lighthouse     # mobile Lighthouse with budgets
pnpm format         # write Prettier formatting
```

## Configuration

Every variable is optional.

```bash
# Canonical origin. Falls back to the Vercel URL, then to localhost.
NEXT_PUBLIC_SITE_URL="https://example.com"

# Client dashboard. When unset, "Client sign in" does not render at all.
NEXT_PUBLIC_DASHBOARD_URL="https://app.example.com"

# External scheduling link. When unset, "Book a call" does not render.
NEXT_PUBLIC_BOOKING_URL="https://cal.example.com/growlabel"

# Contact delivery. Configure ONE of these.
CONTACT_WEBHOOK_URL="https://hooks.example.com/..."
# ...or
RESEND_API_KEY="re_..."
CONTACT_TO_EMAIL="assessments@example.com"
CONTACT_FROM_EMAIL="noreply@example.com"
```

With no delivery provider the contact form renders an explicit "form
unavailable" state. It never accepts details it cannot deliver, and never
simulates a successful submission.

## Documentation

| Document                                                     | Covers                                          |
| ------------------------------------------------------------ | ----------------------------------------------- |
| [CLAUDE.md](CLAUDE.md)                                       | Working notes, conventions, the non-negotiables |
| [docs/SITE_STRATEGY.md](docs/SITE_STRATEGY.md)               | Audience, narrative, conversion model           |
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)               | Thesis, tokens, type, components                |
| [docs/MOTION_SYSTEM.md](docs/MOTION_SYSTEM.md)               | The three verbs and the full inventory          |
| [docs/CONTENT_REQUIREMENTS.md](docs/CONTENT_REQUIREMENTS.md) | Voice, editorial rules, per-page requirements   |
| [docs/CLAIMS_REGISTER.md](docs/CLAIMS_REGISTER.md)           | What may and may not be said publicly           |
| [docs/PERFORMANCE_BUDGET.md](docs/PERFORMANCE_BUDGET.md)     | Targets, measurements, the LCP trade-off        |
| [docs/BUILD_STATE.md](docs/BUILD_STATE.md)                   | Where the build got to, and what is left        |
| [docs/LAUNCH_REPORT.md](docs/LAUNCH_REPORT.md)               | Deployment, verification, launch decisions      |

## Design source

The Claude Design project **Grow Label Website V2** holds the visual thesis,
the design system, the page artboards and the motion storyboard. Its token,
base and component stylesheets are the same files this application ships —
`design/*.css` are copies of `src/styles/*.css`, so the artboards render exactly
as the site does.

## Licence

Private and unlicensed. All rights reserved.
