# Terms

The controlled vocabulary for thegrowlabel.com. One name per thing, on every
page. Enforced by `tests/unit/content-integrity.test.ts`.

The point is not tidiness. A practice owner reading three pages should never
have to work out whether two words mean the same thing, and an operations
manager forwarding a page to a colleague should find the same noun in the
reply.

## Systems

| Use                                                                    | Not                                                                    | Why                                                                                                                                                                                                      |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **practice management system** on first use in a section, then **PMS** | "PIMS", "the PMS system", "practice software", "your system of record" | One term covers both sectors. Veterinary readers say PIMS and dental readers say PMS; spelling the words out first means neither has to translate, and the abbreviation afterwards keeps the copy short. |
| **your phone system**                                                  | "telephony stack", "the switchboard", "VoIP"                           | The reader's word for it.                                                                                                                                                                                |
| **the ledger**                                                         | "accounts", "finance system", "billing"                                | Matches the Collected stage's basis line, which is the only place a payment is evidenced.                                                                                                                |
| **waiting list**                                                       | "waitlist", "the queue"                                                | Two words, as a practice writes it.                                                                                                                                                                      |

## The four value stages

Always these four words, always in this order, always capitalised, and
**never collapsed into one figure**:

**Estimated** → **Booked** → **Attended** → **Collected**

| Use                                                           | Not                                    |
| ------------------------------------------------------------- | -------------------------------------- |
| a figure is **promoted** from one stage to the next           | "converted", "progressed", "moved up"  |
| the **basis** for a figure                                    | "source", "proof", "confidence score"  |
| **Modelled** / **PMS record** / **Ledger** as the three bases | any other wording                      |
| **restatement** when a reported figure changes                | "correction", "adjustment", "revision" |

## The modules

Capitalised, never pluralised into a category noun.

| Use                                                 | Not                                           |
| --------------------------------------------------- | --------------------------------------------- |
| **Answer**, **Respond**, **Retain**, **Reactivate** | "the Answer module" in body copy, "Answer AI" |
| **the four modules**                                | "our suite", "the product family"             |
| **the recovery system** for all four together       | "the platform stack", "our solution"          |

## The work

| Use                                                  | Not                                                 | Why                                                       |
| ---------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------- |
| **the back book**                                    | "dormant list", "lapsed patients", "database" alone | Hyphenate only when adjectival: "back-book pushes".       |
| **an opportunity** for one tracked item              | "a lead", "a prospect"                              | A lead is someone new. These people are already yours.    |
| **a record** for one entry in the practice's systems | "a contact", "a customer"                           |                                                           |
| **rang out** for an unanswered call                  | "abandoned", "missed call" as a noun                | "Missed calls" is fine as a plural noun for the category. |
| **a released slot** / **a gap**                      | "cancellation" for the empty time                   | A cancellation is the event; the gap is what it leaves.   |
| **an assessment**                                    | "audit", "consultation", "discovery call", "demo"   | This is what we actually sell first.                      |

## Register

| Rule                                                             |                                                                                                                                           |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Sentence case everywhere, including eyebrows and labels          | No ALL-CAPS type on the site. Small labels are distinguished by size, weight and colour, not by shouting.                                 |
| Active voice                                                     | "Answer books the appointment", not "the appointment is booked by Answer". Passive is allowed where the actor genuinely does not matter.  |
| Every call to action states what happens                         | "Request a revenue-recovery assessment", not "Get started".                                                                               |
| No em dashes, en dashes as asides, or double hyphens             | Rewrite the sentence: split it, use a colon where a reveal is intended, or restructure.                                                   |
| Numbers over adjectives                                          | "Ten half-hour slots", not "a busy morning".                                                                                              |
| **"AI" appears at most once per page and never leads a section** | We sell recovered appointments and recovered revenue. The technology is not the offer. It currently appears zero times in published copy. |

## Banned words

Enforced by test: seamless, unlock, supercharge, cutting-edge, empower,
leverage (as a verb), revolutionise, game-changing, elevate, best-in-class,
world-class, next-generation, turnkey, synergy, paradigm, AI-powered.

## Claims

No client, logo, testimonial, partner, integration, case study, revenue total,
benchmark, guarantee or performance statistic appears in published copy without
an entry in `docs/CLAIMS_REGISTER.md`. Third-party statistics are not asserted
on the page at all: where a figure matters, it is either expressed as a
labelled illustrative shape in a diagram, or given as something the reader can
measure in their own systems.
