# Design system

Source of truth: `src/styles/tokens.css`, `base.css`, `components.css`.
`design/*.css` are copies of those three files, so the Claude Design artboards
render exactly as production does.

## Direction

Warm white ground, near-black type, graphite detail, and one restrained purple
that appears only where revenue is being **detected, recovered or verified**.
Light-first: dark sections are deliberate punctuation, not the norm.

Apple-like in the sense that matters — precision, restraint, one typeface, real
whitespace — without imitating Apple's layouts.

### Deliberately not

No purple gradients. No glowing orbs. No glassmorphism beyond the two places a
blur genuinely helps (the floating nav and a modal backdrop). No stock clinic
photography. No repetitive grid of identical rounded cards.

## Colour

| Token                            | Value                 | Role                                      |
| -------------------------------- | --------------------- | ----------------------------------------- |
| `--gl-white`                     | `#FBFAF8`             | Warm white — the default page             |
| `--gl-paper`                     | `#F4F3F0`             | Raised warm grey band                     |
| `--gl-mist`                      | `#EAE8E3`             | Light grey — wells and tracks             |
| `--gl-edge`                      | `#DEDBD5`             | Light grey — visible dividers             |
| `--gl-ink`                       | `#0C0C0E`             | Near-black — headlines, footer            |
| `--gl-graphite`                  | `#33333A`             | Graphite — secondary type                 |
| `--gl-graphite-deep`             | `#17171B`             | Graphite — dark sections                  |
| `--gl-slate` / `--gl-slate-soft` | `#6C6C75` / `#8F8F98` | Muted and faint type                      |
| `--gl-purple`                    | `#4A3AC4`             | The accent on light — 8.1:1 on warm white |
| `--gl-purple-bright`             | `#9A8FF0`             | The accent on dark — 7.2:1 on graphite    |

Semantic colour is used only where the colour carries the meaning:
`--gl-verified` (#1A6F56) for a confirmed state and `--gl-alert` (#B3261E)
for form errors. Nothing else is coloured to look lively.

The four value stages remain **one hue at four densities** — the same money at
four levels of certainty, never four different colours.

## Typography

**One typeface: Schibsted Grotesk**, variable 400–900, latin subset, a single
file on the critical path.

Hierarchy comes from weight, size, tracking and colour rather than from a second
family — the discipline Apple applies with SF, and the reason the page reads as
one system instead of an assembly. Neither Inter, Poppins, Geist, Manrope nor DM
Sans appears anywhere.

| Token       | Size                                  | Use                          |
| ----------- | ------------------------------------- | ---------------------------- |
| `d0`        | `clamp(2.875rem, 8.4vw, 7.5rem)`      | The hero. One per site.      |
| `d1`        | `clamp(2.75rem, 6.4vw, 6rem)`         | Closing statements           |
| `d2`        | `clamp(2.125rem, 4.6vw, 4rem)`        | Section headlines            |
| `d3` / `d4` | `fluid`                               | Sub-sections and item titles |
| `lead`      | `clamp(1.0625rem, 1.25vw, 1.3125rem)` | Standfirst                   |
| `label`     | `0.75rem, 0.09em, uppercase`          | Eyebrows and axis labels     |

Display tracking tightens as size grows, from `-0.018em` at `d4` to
`-0.042em` at `d0` — large type needs less air between letters, not more.

**Tabular figures are not global.** This face maps the comma and the full stop
to figure width under `tnum` — they double as decimal separators — which
opens a visible gap before every one of them in running prose. `font-variant-numeric`
is therefore applied per component (`.mono`, `.figure`, `.lrow__idx`, stage
figures), wherever numbers genuinely need to align in a column.

## Structure

`--gl-slot: 46px` is the schedule-slot unit the spacing scale is tuned to.
Twelve columns above 900px, six below. Gutter is `clamp(20px, 4.4vw, 64px)`;
section padding is `clamp(72px, 9vw, 152px)`.

Hairline rules do all the dividing work. Elevation is used almost nowhere.

## Components

| Component         | Class         | Notes                                                        |
| ----------------- | ------------- | ------------------------------------------------------------ |
| Section header    | `.sec-head`   | Index, statement, right-aligned aside, closing rule          |
| Ledger row        | `.lrow`       | Index, key, detail, trailing classification                  |
| Four-stage bar    | `.stagebar`   | The signature proof device                                   |
| Capacity column   | `.capcol`     | Filled / open / recovered slots, width-capped by `.capblock` |
| Key-value strip   | `.kv`         | Hairline-separated cells, never a card grid                  |
| Step list         | `.steps`      | Numbered only where order carries meaning                    |
| Escalation ladder | `.ladder`     | Trigger on the left, handover on the right                   |
| Stage matrix      | `.matrix`     | Influences vs observes, per module                           |
| Site comparison   | `.sites`      | Veterinary signature device                                  |
| Recall rail       | `.rail`       | Dental signature device                                      |
| Spec table        | `.spec`       | Four columns ending in prose, for reference tables           |
| Module rail       | `.rail-index` | Where you are in the four-module system                      |

### Ledger row variants

The trailing column is a **fixed 11rem**, not `auto`. An auto track resizes with
the longest tag in each row, and the detail column then starts at a different x
on every line, which reads as misalignment down the ledger.

Use the modifiers, never an inline `gridTemplateColumns` — an inline style wins
on specificity and silently defeats the mobile rules:

| Modifier             | Shape                                            |
| -------------------- | ------------------------------------------------ |
| `.lrow--pair`        | Index + content                                  |
| `.lrow--pair-action` | Index + content + trailing affordance            |
| `.lrow--action`      | Content + trailing affordance                    |
| `.lrow--stage`       | Term + definition + basis, valid inside a `<dl>` |

## Responsive behaviour

Mobile is a re-composition, not a stack.

| Breakpoint | What changes                                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| ≥ 1440     | 12 columns, 64px gutter, hero splits 1 / 0.42                                                                                    |
| 1080–1439  | Navigation links compress; module blocks stay three across                                                                       |
| < 1080     | Nav collapses to the drawer; hero becomes one column; the hero aside and the decorative signal marks are **removed, not shrunk** |
| < 900      | Two-column sections stack; sticky asides become static                                                                           |
| < 760      | Ledger rows stack, with every cell after the index moving to the content column                                                  |
| < 620      | The stage bar becomes name + basis on one line, track beneath                                                                    |

Every control has a 24×24 minimum target (WCAG 2.2 AA), and primary actions
clear 44px. Hover-only affordances — the retracting rule, the travelling arrow —
carry no information.

## Accessibility contract

- Focus is always visible: a 2px accent outline at 3px offset, colour-matched
  to the ground.
- A skip link is the first tab stop and moves focus into `#site-main`.
- The drawer traps focus, closes on Escape, restores focus to its toggle and
  locks background scroll.
- Decorative ordinals, glyphs and graphics are `aria-hidden`, so they never
  enter an accessible name.
- Every chart-like device carries a text alternative describing what it shows.
- Status is never carried by colour alone.
