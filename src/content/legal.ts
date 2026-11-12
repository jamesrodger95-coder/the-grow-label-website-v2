/**
 * Privacy and terms copy for The Grow Label's content studio site.
 *
 * These describe how this website behaves. Paid work is governed by its own
 * written agreement, and these pages say so. Nothing here may state a result,
 * a client, or a figure the business cannot show.
 */

export const LAST_UPDATED = '2026-11-12';

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
};

export const PRIVACY: LegalSection[] = [
  {
    heading: 'Scope of this notice',
    paragraphs: [
      'This notice covers personal data collected through this website, including the sample pages we send to businesses. Paid work for a client is covered by the agreement we sign for that work.',
    ],
  },
  {
    heading: 'What this site collects',
    paragraphs: [
      'We only collect what you choose to send us, plus a small amount of information about how a sample page we sent you is used.',
    ],
    list: [
      'The free sample form: your name, email address and website, and, if you add them, a page to feature and a note about what you would like to see.',
      'The contact form: your name, email address and your message.',
      'Sample pages: when a page made for your business is opened, played or used to book a call, we record that it happened and when. We do not record who you are beyond the business the page was made for.',
      'This site sets no advertising or analytics cookies. Your IP address is used briefly to limit repeated form submissions and is not stored with what you send.',
    ],
  },
  {
    heading: 'How we use it',
    paragraphs: [
      'We use what you send to make your sample, to reply to you, and to talk with you about work you have asked about. We do not sell it or share it for anyone else’s marketing.',
      'Form submissions are stored on our own systems so that we can read and answer them.',
    ],
  },
  {
    heading: 'Lawful basis and retention',
    paragraphs: [
      'We rely on legitimate interest: you have asked us for a sample or a reply, and we need your details to give you one.',
      'We keep your details while the conversation is live and delete them when it is over. You can ask us to delete them sooner at any time.',
    ],
  },
  {
    heading: 'Your rights',
    paragraphs: [
      'You can ask what personal data we hold about you, ask us to correct or delete it, or object to how we use it. You can also complain to the Information Commissioner’s Office.',
      'To do any of these, send us a message through the contact page. We will reply within the statutory period.',
    ],
  },
  {
    heading: 'Third parties',
    paragraphs: [
      'This site is hosted by Vercel, which keeps request logs for security and reliability. Fonts are served from this domain.',
      'Sample pages include a booking calendar from Cal.com. If you book a call, Cal.com handles the booking details under its own privacy policy.',
    ],
  },
  {
    heading: 'Changes',
    paragraphs: [
      'When this notice changes materially, the date at the top of this page changes with it.',
    ],
  },
];

export const TERMS: LegalSection[] = [
  {
    heading: 'About these terms',
    paragraphs: [
      'These terms cover your use of this website and of any sample page we send you. Paid work is covered by the written agreement we make for it, and that agreement takes precedence over anything here.',
    ],
  },
  {
    heading: 'The work shown on this site',
    list: [
      'Work made for a business carries that business’s name. Work we made on our own initiative is labelled as concept work, and any brand shown in it is invented.',
      'Nothing on this site is a promise of results. We make content; how it performs depends on many things outside our control.',
      'Nothing on this site is an offer of a fixed price. Prices are agreed in writing before any paid work starts.',
    ],
  },
  {
    heading: 'Free samples',
    paragraphs: [
      'A free sample is made for you to review. There is no charge and no obligation to buy anything. Any use of a sample beyond reviewing it is agreed with us separately.',
      'Samples are made from material on your public website. If you would rather we did not use something, tell us and we will remove it.',
    ],
  },
  {
    heading: 'Acceptable use',
    paragraphs: [
      'You may read and share this site. You may not interfere with how it works, probe it for vulnerabilities without our written permission, or send anything through its forms that you have no right to send.',
    ],
  },
  {
    heading: 'Intellectual property',
    paragraphs: [
      'The text, design, code and work on this site belong to The Grow Label, or to the business credited where a piece was made for a client. Please ask before reusing any of it.',
    ],
  },
  {
    heading: 'Liability',
    paragraphs: [
      'This site is provided as it is. To the extent the law allows, we are not liable for loss caused by relying on it rather than on a signed agreement. Nothing in these terms limits liability for fraud, or anything else that cannot lawfully be limited.',
    ],
  },
  {
    heading: 'Governing law',
    paragraphs: [
      'These terms are governed by the law of England and Wales, and its courts have exclusive jurisdiction over any dispute arising from them.',
    ],
  },
];
