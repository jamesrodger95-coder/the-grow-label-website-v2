/**
 * Privacy and terms copy.
 *
 * These describe how this marketing website behaves. They are not a substitute
 * for the data-processing agreement that governs a client engagement, and they
 * say so. Company registration details, a registered address and a data
 * controller contact must be supplied before launch — see docs/CLAIMS_REGISTER.md.
 */

export const LAST_UPDATED = '2026-08-30';

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
};

export const PRIVACY: LegalSection[] = [
  {
    heading: 'Scope of this notice',
    paragraphs: [
      'This notice covers personal data collected through this website only. It does not cover data processed on behalf of a client under an engagement: that is governed by the data-processing agreement signed at the start of the engagement, in which Grow Label acts as a processor and the practice remains the controller.',
      'No client, patient or clinical data is held on this website, published on it, or reachable from it.',
    ],
  },
  {
    heading: 'What this site collects',
    paragraphs: [
      'The only personal data this site collects is what you type into the assessment request form: your name, work email address, organisation, optional role, the sector and size band you select, and the message you write.',
    ],
    list: [
      'The form is for commercial enquiries. It asks for no client, patient or clinical information, and you should not include any.',
      'The form does not use cookies, and this site sets no analytics, advertising or tracking cookies of any kind.',
      'Your IP address is used transiently to apply a rate limit to the form endpoint. It is not written to a database and is not associated with your submission.',
    ],
  },
  {
    heading: 'How a submission is handled',
    paragraphs: [
      'A submission is passed to the configured delivery provider — an internal webhook or a transactional email provider — so that a person can read and reply to it. It is not stored in a database by this website.',
      'If no delivery provider is configured on a given deployment, the form is switched off and tells you so. It never accepts details it cannot deliver.',
    ],
  },
  {
    heading: 'Lawful basis and retention',
    paragraphs: [
      'The lawful basis for handling an enquiry is legitimate interest: you have asked us to respond to a commercial question, and we need your details to do it.',
      'Enquiries are retained for as long as the commercial conversation is live, and are then deleted in line with our internal retention schedule. You can ask for yours to be deleted sooner at any time.',
    ],
  },
  {
    heading: 'Your rights',
    paragraphs: [
      'You have the right to ask what personal data we hold about you, to have it corrected, to have it deleted, to object to our handling of it, and to complain to the Information Commissioner’s Office.',
      'To exercise any of these, use the contact route published on this site. We will confirm receipt and respond inside the statutory period.',
    ],
  },
  {
    heading: 'Third parties',
    paragraphs: [
      'This site is served by a hosting provider, which processes request logs on our behalf for security and availability. Fonts are self-hosted and served from this domain, so no font request leaves it.',
      'There are no advertising networks, session recorders, chat widgets, embedded videos or social plugins on this site.',
    ],
  },
  {
    heading: 'Changes',
    paragraphs: [
      'When this notice changes materially, the date at the top of this page changes with it. Previous versions are retained internally.',
    ],
  },
];

export const TERMS: LegalSection[] = [
  {
    heading: 'About these terms',
    paragraphs: [
      'These terms govern your use of this website. They do not govern a Grow Label engagement: the commercial terms, service levels and data-processing terms for an engagement are set out in the agreement signed at the start of it, and that agreement takes precedence over anything published here.',
    ],
  },
  {
    heading: 'The status of the information on this site',
    paragraphs: [
      'Everything on this site describes designed behaviour and measurement definitions. It is not an offer, a warranty, or a representation about results.',
    ],
    list: [
      'No figure on this site is a client figure. Every proportion shown in a diagram is illustrative of a shape, not evidence of an outcome.',
      'No benchmark, industry average or comparison figure is published anywhere on this site.',
      'No performance guarantee is offered, expressly or by implication.',
      'Recovered value depends on demand that already exists in a practice’s data, on capacity being available, and on the practice acting on escalations.',
    ],
  },
  {
    heading: 'No clinical content',
    paragraphs: [
      'Nothing on this site is clinical advice, guidance or assessment, and the platform it describes performs none. Clinical judgement, triage and treatment decisions rest entirely with the practice and its registered professionals.',
    ],
  },
  {
    heading: 'Acceptable use',
    paragraphs: [
      'You may read, print and share this site for your own commercial evaluation. You may not attempt to interfere with its availability, probe it for vulnerabilities without written permission, or submit content through its form that you have no right to send.',
      'Do not submit client, patient or clinical information through any form on this site.',
    ],
  },
  {
    heading: 'Intellectual property',
    paragraphs: [
      'The text, design, code and diagrams on this site belong to Grow Label unless stated otherwise. The measurement definitions may be quoted with attribution — we would rather they were used than not.',
    ],
  },
  {
    heading: 'Liability',
    paragraphs: [
      'This site is provided as it is. To the extent permitted by law, Grow Label is not liable for loss arising from reliance on information published here rather than on the terms of a signed engagement. Nothing in these terms limits liability for fraud, or for anything that cannot lawfully be limited.',
    ],
  },
  {
    heading: 'Governing law',
    paragraphs: [
      'These terms are governed by the law of England and Wales, and the courts of England and Wales have exclusive jurisdiction over any dispute arising from them.',
    ],
  },
];
