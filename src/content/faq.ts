/**
 * Frequently asked questions.
 *
 * Written to answer the questions a buyer actually asks before a first call —
 * price, contract, data, effort, and where the boundary sits — rather than the
 * questions that are comfortable to answer. Nothing here asserts an outcome.
 */

export type FaqItem = {
  q: string;
  a: string[];
};

export type FaqGroup = {
  id: string;
  label: string;
  items: FaqItem[];
};

/** The general set, shown on the contact page. */
export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: 'assessment',
    label: 'The assessment',
    items: [
      {
        q: 'What does the assessment actually cost?',
        a: [
          'Nothing, and there is no obligation attached to it. We do it because it is the only honest way to find out whether there is enough lost demand in your data to be worth either side’s time.',
          'You keep the written analysis whether or not you go further, and it is written to be useful on its own — several of the findings are things a practice can act on without us.',
        ],
      },
      {
        q: 'How long does it take, and what do you need from us?',
        a: [
          'Around three weeks from the scoping call. From you it needs one conversation of about thirty minutes to agree the window and the data in scope, then read access to a historical export.',
          'Nothing is installed, nothing is connected to live systems, and nothing in your practice changes to produce it.',
        ],
      },
      {
        q: 'What is in it?',
        a: [
          'Where demand was lost across the window, broken down by channel, by site and by hour, using your own definitions. The estimated value of that demand, priced from your own fee schedule. Which modules would address which part of it. And a plain statement of what the data cannot tell us.',
          'It does not contain a forecast of booked, attended or collected value. Those require live data, and quoting them from a historical window would be exactly the kind of number this whole site argues against.',
        ],
      },
    ],
  },
  {
    id: 'commercial',
    label: 'Commercial',
    items: [
      {
        q: 'How is Grow Label priced?',
        a: [
          'A fixed monthly platform fee per site, plus the modules you run. The figure depends on your contact volume and the number of locations, which is why it comes out of the assessment rather than off a pricing page.',
          'We do not price on a share of recovered revenue. Attribution is a model, and a provider whose invoice depends on its own attribution model has an obvious reason to be generous with it.',
        ],
      },
      {
        q: 'Is there a minimum term?',
        a: [
          'An initial period long enough for the reporting to mean something — usually three months, because a single month of recall or reactivation work tells you very little — and then rolling, with notice.',
          'No result is guaranteed by us or by anybody else in this category. Recovery depends on demand that already exists in your data, on capacity being available to absorb it, and on your team acting on escalations.',
        ],
      },
      {
        q: 'Do we have to run all four modules?',
        a: [
          'No, and most groups should not start that way. The assessment shows which of the four is losing you the most, and that is usually the one to begin with.',
          'The modules report into the same four value stages whether you run one or all of them, so adding a second later does not restate the first one’s figures.',
        ],
      },
    ],
  },
  {
    id: 'data',
    label: 'Data and systems',
    items: [
      {
        q: 'Do you need access to clinical records?',
        a: [
          'No. The boundary is drawn deliberately narrow: contact events, the appointment book, interval and plan status, your published fee schedule, and consent state.',
          'Clinical notes, histories, images, results and the content of a treatment plan are never read, requested or stored. Grow Label needs to know that an accepted plan has no appointment attached. It does not need to know what the plan is.',
        ],
      },
      {
        q: 'Which practice management and phone systems do you work with?',
        a: [
          'We name no vendor on this site until the integration is live, supported, and we have permission to name them, so the honest answer is that it is a question for the scoping call.',
          'The general shape: where a system offers read access we read it, and where it offers write access a module can create an appointment inside the scope you have approved. Where there is no write access, the contact is captured and the booking is handed to your team instead of being held.',
        ],
      },
      {
        q: 'What happens to a figure if the appointment behind it is cancelled?',
        a: [
          'It moves back out of the booked stage. Value is promoted between stages only on a system record, and it demotes on one too.',
          'If that changes a figure in a report you have already received, the change is shown as a restatement with the previous value, the new value, the date and the reason retained. Reports are not silently rewritten.',
        ],
      },
    ],
  },
  {
    id: 'boundary',
    label: 'The boundary',
    items: [
      {
        q: 'Will patients or clients know they are not speaking to your team?',
        a: [
          'Every message sent in your name is approved by you before it is used, and the practice sets the tone and the wording. Nothing misrepresents who is contacting somebody or on whose behalf.',
          'Anyone who asks to speak to the practice is handed to the practice. A contact who asks not to be approached again is suppressed immediately, across every module, and it is recorded against the record.',
        ],
      },
      {
        q: 'What happens if somebody describes a symptom?',
        a: [
          'It is routed to your own emergency route immediately and unanswered. No module triages, assesses, advises or diagnoses, in any form, at any hour.',
          'This is a hard boundary rather than a policy that can be relaxed for a particular client. It is the one part of the configuration a practice cannot change.',
        ],
      },
      {
        q: 'Who decides what a module is allowed to do?',
        a: [
          'You do, during configuration, and you can lower the ceiling at any time without a conversation. Booking scope is a whitelist of appointment types. Contact policy sets channels, hours, attempt limits and intervals. Escalation triggers are named conditions with a response expectation attached.',
          'There is no mode in which the system decides for itself what it is allowed to do.',
        ],
      },
    ],
  },
];

/** Short, sector-specific sets shown on the two industry pages. */
export const SECTOR_FAQ: Record<'veterinary' | 'dental', FaqItem[]> = {
  veterinary: [
    {
      q: 'Does this replace our out-of-hours provider?',
      a: [
        'No. Out-of-hours clinical cover is a different service and stays exactly where it is. Anything clinical or urgent routes straight to it, unanswered.',
        'What Answer covers is the non-clinical contact that currently reaches an answerphone: booking a consult, moving an appointment, asking about a wellness plan. Those produce no record today and no worklist for the morning.',
      ],
    },
    {
      q: 'Who decides which recall intervals are used?',
      a: [
        'The practice, as a clinical decision. Reactivate reads the due date your system already holds. It never sets an interval, never shortens one, and never recommends a change to one.',
      ],
    },
    {
      q: 'We are a group. Can we compare sites?',
      a: [
        'That is usually the more useful output. Every site is measured on identical definitions and the same four stages, so the comparison reflects the sites rather than four different reporting habits.',
        'The interesting question is rarely how much was recovered across the group. It is which site is losing demand the others are not, and whether that is a rota problem, a systems problem or a local one.',
      ],
    },
    {
      q: 'Will owners get more contact than they want?',
      a: [
        'Contact is capped by you: attempts per record, the interval between them, the channels allowed and the hours they may be used. When the cap is reached the record is closed with a recorded reason rather than approached again.',
        'A list worked without a stop rule is a campaign, and campaigns are how a practice annoys the clients it most wants back.',
      ],
    },
  ],
  dental: [
    {
      q: 'Do you read treatment plans?',
      a: [
        'Only whether an accepted plan has an appointment attached to it. The content of the plan — what the treatment is, why it was recommended, what was discussed — is clinical, and it is never read, quoted or used.',
      ],
    },
    {
      q: 'Can you report by provider?',
      a: [
        'Yes, and on the same four stages for every provider, which is the only way that comparison is worth making. The number that matters is the distance between accepted and attended, not the acceptance figure on its own.',
        'Case mix explains a lot of that distance. The reporting shows you the gap; it does not pretend to explain it.',
      ],
    },
    {
      q: 'How does this sit alongside our hygiene recall system?',
      a: [
        'It works the list your system already produces rather than replacing it. What changes is that the list is worked to a stop rule instead of until the day runs out, and how far it was worked becomes a reported figure.',
      ],
    },
    {
      q: 'What about plan patients and finance arrangements?',
      a: [
        'Plan status is read as status only — active, lapsed, due — because that is what determines whether an appointment is owed. Payment arrangements, balances and finance agreements are not read and are not discussed in any contact.',
      ],
    },
  ],
};
