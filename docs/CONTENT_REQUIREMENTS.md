# Content requirements

Every word a reader sees lives in `src/content/`. A route file assembles
sections; it must not contain a sentence a reader will see. This is what makes
the content-integrity test possible, and it is why copy can be reviewed without
reading JSX.

## Voice

Confident, clear, commercially intelligent. Written for someone who has to
defend the decision to a board.

**Every headline must communicate a concrete idea.** A headline that could sit
on any competitor's site is a failed headline. Compare:

| No                        | Yes                                                                  |
| ------------------------- | -------------------------------------------------------------------- |
| Transform your practice   | A busy practice and a leaking one look identical from the front desk |
| Powerful revenue insights | One number is a claim. Four numbers are an account                   |
| Save time and money       | The second return is hours back at the front desk                    |
| Full transparency         | Every figure opens into the event that produced it                   |

Sentences are declarative and short. Numbers are specific or absent. The italic
in a display headline is a semantic device — it marks the turn in the sentence,
usually the recovered or lost half — not decoration.

## Banned language

Enforced by `tests/unit/content-integrity.test.ts`, which fails the build:

`unlock the power` · `revolutionise` · `cutting-edge` · `seamless` ·
`game-changing` · `supercharge` · `best-in-class` · `world-class` ·
`next-generation` · `leverage our` · `AI-powered` · `powered by AI` ·
`turnkey` · `synergy` · `paradigm`

Also avoided, though not machine-checkable: empty enterprise register, generic
feature lists, repetitive headline shapes, and any use of "AI" that is not
load-bearing.

## Claims discipline

The test also greps for **asserted** claims and fails on:

- A percentage or multiple attached to an uplift, return or improvement
- "clients see", "practices typically recover" and their variants
- `guarantee` in any form
- `industry average`, `benchmark`, `standard`
- `testimonial`, `case study`, `trusted by`, `our clients include`, `as used by`

The check is **negation-aware**. Several pages exist precisely to rule these
claims out — the methodology page has a section named _What Grow Label cannot
credibly claim_ — so a hit only counts when the surrounding sentence, or the
object entry containing it, carries no negation. A regression test proves both
directions: an asserted claim fails, the same words denied do not.

Anything that would need evidence goes in [CLAIMS_REGISTER.md](CLAIMS_REGISTER.md).

## The four value stages

Non-negotiable, and asserted by test:

1. They are always four, always in order: Estimated, Booked, Attended, Collected.
2. Each carries its confidence basis: modelled, system record, system record,
   ledger.
3. **Only collected value may be described as revenue.** No other stage's
   description may contain "is revenue".
4. They are never summed, averaged, blended or presented as one figure.
5. Any illustrative proportion carries a caption saying it is illustrative and
   not a benchmark.

## Clinical boundary

No page may make, imply or invite a clinical claim. The product reads scheduling
and contact data; it does not triage, advise, assess, diagnose or recommend.

Both industry pages carry an explicit boundaries section, and the test asserts
that every module declares clinical records among the data it does **not**
require.

## Per-page requirements

### Homepage

Eight numbered beats in fixed order, as set out in
[SITE_STRATEGY.md](SITE_STRATEGY.md). The hero must state the proposition, the
sector and the action in the initial HTML — no loader, no gate, no compulsory
animation.

### Module pages

Every module must supply all of the following, and the test fails if any is
missing or thin:

| Part                          | Rule                                                             |
| ----------------------------- | ---------------------------------------------------------------- |
| The operational problem       | Written from the front desk outward, naming shift, hour, channel |
| What it monitors              | Actual event types, ≥3                                           |
| What it does                  | Specific actions with stop conditions, ≥3                        |
| What the client team controls | Explicit list of decisions that never leave the practice, ≥3     |
| Human escalation points       | Named triggers with the intended handover, ≥3                    |
| Relevant revenue stages       | All four, each marked _influences_ or _observes_                 |
| Operational data required     | Minimum feed, ≥2, plus what is explicitly not required           |
| Evidence the client inspects  | The record each action leaves, ≥2                                |
| Commercial outcome + CTA      | What changes on the schedule and in the ledger                   |

The _influences / observes_ distinction matters: a module that only observes a
stage cannot move value into it, and saying so is the difference between doing
the work and reporting on it.

**Modules are never described as undefined autonomous magic.** Every action has
a defined trigger and a defined ceiling, and the copy says so.

### Industry pages

Veterinary and dental must be **genuinely different**, and the test enforces it:
different signature devices, no shared workflow title, different thesis copy.

Both are framed as _workflow candidates_ — places demand is commonly lost and
the data needed to act on them — never as case studies or delivered outcomes.

### Methodology

Must define estimated, booked, attended and collected value; attribution status;
data confidence; source-event traceability; duplicate prevention; corrections
and restatements; and reporting period and cut-off.

Must carry the _What Grow Label cannot credibly claim_ section. That section is
not optional and must not be softened.

### Contact

- States the four-step journey before showing a field.
- States what the assessment does not cover as prominently as what it does.
- No field asks for client, patient, clinical or otherwise sensitive data, and
  the notice on the message field says so.
- Never simulates a successful submission.

### Legal

Privacy and terms describe this website's actual behaviour, and say plainly that
a client engagement is governed by its own agreement instead. Both flag that
company registration details are added at launch rather than inventing them.

## Style conventions

- British English throughout: organisation, recognise, licence (noun).
- Sentence case for headings, including display type.
- En dashes with spaces for parenthetical asides — like this.
- `·` as the separator inside mono labels.
- Numerals are tabular everywhere; a figure never reflows as it changes.
- Section indices are `§ 01 / 08` in mono, and the denominator must match the
  real number of sections.
