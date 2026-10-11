/**
 * /AI: the content studio.
 *
 * A separate offering from the revenue-recovery site: AI-made video, imagery
 * and ad creative for businesses that sell something, whether that is a
 * product, software or a service. The first audiences are ecommerce brands,
 * B2B SaaS, home improvement and the trades (HVAC, plumbing, electrical). The
 * page is reached from cold outreach that offers a free sample. Every word on
 * it lives here, in the same way the rest of the site keeps copy out of routes.
 *
 * Two rules carry over unchanged from the main site:
 *
 *   - No invented evidence. No client names, results, uplift figures or
 *     testimonials. The work is shown as work; it is never presented as proof
 *     that it sold anything. The briefs in STUDIO_INDUSTRIES are labelled as
 *     examples on the page, because that is what they are.
 *   - Every piece of work is labelled for what it is. A real project carries
 *     the brand it was made for; anything made on spec says "Concept work".
 *
 * No em dashes anywhere in this file's copy. The page is checked for them.
 */

export const STUDIO_META = {
  title: 'The Grow Label: AI video, imagery and ad creative for businesses that sell',
  description:
    'Videos, images and ad creative designed to help turn more visitors into customers. Created with AI, built around your brand, for products, software and services. Request a free sample.',
} as const;

export const STUDIO_NAV = {
  brand: 'The Grow Label',
  tag: 'Studio',
  links: [
    { href: '#work', label: 'Work' },
    { href: '#industries', label: 'Industries' },
    { href: '#make', label: 'What we make' },
    { href: '#process', label: 'Process' },
  ],
  cta: { href: '#sample', label: 'Free sample' },
} as const;

export const STUDIO_HERO = {
  eyebrow: 'AI content for products, software and services',
  titleLine: 'Turn what you sell',
  titleRest: 'into content',
  titleEmphasis: 'that sells.',
  lead: 'Videos, images and ad creative designed to help turn more visitors into customers. Created with AI, built around your brand.',
  primary: { href: '#sample', label: 'Get a free sample' },
  secondary: { href: '#work', label: 'Explore the work' },
  note: 'One product or service, free. No purchase required.',
  reelLabel: 'A curved wall of short videos made by The Grow Label, playing silently.',
  reelSlotsLabel: 'Reserved frames for the video reel.',
  pause: 'Pause motion',
  play: 'Play motion',
} as const;

/** The drifting band under the hero: who the work is for. */
export const STUDIO_BAND = [
  'Ecommerce',
  'B2B SaaS',
  'Home improvement',
  'HVAC',
  'Plumbing',
  'Electrical',
] as const;

export const STUDIO_WORK = {
  eyebrow: 'Selected work',
  title: 'One idea,',
  emphasis: 'many ways to show it.',
  lead: 'Each piece is shown as it was delivered. Work made for a business carries that business’s name. Anything we made on our own initiative is labelled as concept work.',
  filters: [
    { id: 'all', label: 'All' },
    { id: 'video', label: 'Video' },
    { id: 'imagery', label: 'Imagery' },
    { id: 'ads', label: 'Ad creative' },
    { id: 'demos', label: 'Demos' },
  ],
  filterLabel: 'Filter the work',
  open: 'View larger',
  concept: 'Concept work',
  slot: 'Frame reserved',
  viewer: {
    close: 'Close',
    previous: 'Previous piece',
    next: 'Next piece',
    of: 'of',
  },
} as const;

export type IndustryOutput = {
  format: string;
  kind: 'Video' | 'Images';
  ratio: '9:16' | '4:5' | '1:1' | '16:9';
};

export type Industry = {
  /** Also the filename stem in public/ai/industries/. */
  slug: string;
  label: string;
  /** An example of the kind of brief we take. Labelled as an example. */
  brief: string;
  outputs: IndustryOutput[];
};

/**
 * The sticky industry section. Each brief is an illustration of the kind of
 * request we work from, not a project we have delivered, and the page says
 * "Example brief" above it for exactly that reason.
 */
export const STUDIO_INDUSTRIES = {
  eyebrow: 'Industries',
  title: 'Whatever you sell,',
  emphasis: 'it can look this good.',
  lead: 'The same studio, pointed at very different businesses. Pick one, or scroll through them.',
  briefLabel: 'Example brief',
  outputsLabel: 'What we would make',
  tabsLabel: 'Choose an industry',
  items: [
    {
      slug: 'ecommerce',
      label: 'Ecommerce',
      brief: 'Turn our new bottle into a product page loop and three short ads for Meta.',
      outputs: [
        { format: 'Product page loop', kind: 'Video', ratio: '4:5' },
        { format: 'Meta ad, three hooks', kind: 'Video', ratio: '9:16' },
        { format: 'Lifestyle set of six', kind: 'Images', ratio: '1:1' },
      ],
    },
    {
      slug: 'saas',
      label: 'B2B SaaS',
      brief: 'Show a manager approving a timesheet in our app, in under thirty seconds.',
      outputs: [
        { format: 'Feature demo', kind: 'Video', ratio: '16:9' },
        { format: 'LinkedIn ad', kind: 'Video', ratio: '1:1' },
        { format: 'Launch visuals', kind: 'Images', ratio: '16:9' },
      ],
    },
    {
      slug: 'home-improvement',
      label: 'Home improvement',
      brief: 'Show a tired kitchen becoming the finished refit, for our website and ads.',
      outputs: [
        { format: 'Before and after', kind: 'Video', ratio: '4:5' },
        { format: 'Facebook ad', kind: 'Video', ratio: '9:16' },
        { format: 'Room visuals', kind: 'Images', ratio: '4:5' },
      ],
    },
    {
      slug: 'hvac',
      label: 'HVAC',
      brief: 'Explain what happens on heat pump install day, so customers know what to expect.',
      outputs: [
        { format: 'Service explainer', kind: 'Video', ratio: '16:9' },
        { format: 'Local ad', kind: 'Video', ratio: '9:16' },
        { format: 'Service page visuals', kind: 'Images', ratio: '16:9' },
      ],
    },
    {
      slug: 'plumbing',
      label: 'Plumbing',
      brief: 'A short ad for emergency call-outs that feels calm and reassuring, not pushy.',
      outputs: [
        { format: 'Emergency ad, three hooks', kind: 'Video', ratio: '9:16' },
        { format: 'Google Business video', kind: 'Video', ratio: '1:1' },
        { format: 'Website hero visual', kind: 'Images', ratio: '16:9' },
      ],
    },
    {
      slug: 'electrical',
      label: 'Electrical',
      brief: 'Walk a homeowner through an EV charger install, from survey to first charge.',
      outputs: [
        { format: 'Install walkthrough', kind: 'Video', ratio: '16:9' },
        { format: 'Short ad cut', kind: 'Video', ratio: '9:16' },
        { format: 'Social set of four', kind: 'Images', ratio: '4:5' },
      ],
    },
  ] satisfies Industry[],
} as const;

export const STUDIO_STATEMENT = {
  before: 'AI is how we make it.',
  after: 'Selling what you sell is the point.',
} as const;

export type Treatment = 'Video' | 'Explainer' | 'Imagery' | 'Styled shoot' | 'Ad creative' | 'Demo';

export type WorkFilter = 'video' | 'imagery' | 'ads' | 'demos';

export const TREATMENT_FILTER: Record<Treatment, WorkFilter> = {
  Video: 'video',
  Explainer: 'video',
  Imagery: 'imagery',
  'Styled shoot': 'imagery',
  'Ad creative': 'ads',
  Demo: 'demos',
};

/**
 * Who a piece was made for.
 *
 * `client` only when the business commissioned it and has agreed to it being
 * shown. Anything else is `concept`. There is no third option, and a piece
 * whose file is present but whose credit is missing fails
 * `tests/unit/studio-media.test.ts` rather than shipping unlabelled.
 */
export type Credit = { kind: 'client'; brand: string } | { kind: 'concept' };

export type WorkEntry = {
  /** Also the filename stem in public/ai/work/. See docs/media/STUDIO_MEDIA.md. */
  id: string;
  media: 'video' | 'image';
  treatment: Treatment;
  /** Width over height, as the frame is reserved on the page. */
  ratio: '9:16' | '4:5' | '3:4' | '1:1' | '16:9';
  /** Filled in when the file arrives. Never before. */
  title?: string;
  /** What was being sold, e.g. "Skincare" or "HVAC". Filled in with the file. */
  category?: string;
  credit?: Credit;
};

/**
 * The portfolio, in display order.
 *
 * Twelve frames, chosen for a spread of treatments and shapes rather than to
 * fill a grid. Each one renders as a reserved frame until its file is in
 * public/ai/work/, and as the work itself once it is.
 */
export const WORK: WorkEntry[] = [
  { id: 'w01', media: 'video', treatment: 'Video', ratio: '9:16' },
  { id: 'w02', media: 'image', treatment: 'Styled shoot', ratio: '4:5' },
  { id: 'w03', media: 'video', treatment: 'Explainer', ratio: '16:9' },
  { id: 'w04', media: 'video', treatment: 'Ad creative', ratio: '1:1' },
  { id: 'w05', media: 'image', treatment: 'Imagery', ratio: '3:4' },
  { id: 'w06', media: 'video', treatment: 'Demo', ratio: '16:9' },
  { id: 'w07', media: 'video', treatment: 'Ad creative', ratio: '9:16' },
  { id: 'w08', media: 'image', treatment: 'Styled shoot', ratio: '4:5' },
  { id: 'w09', media: 'video', treatment: 'Video', ratio: '4:5' },
  { id: 'w10', media: 'image', treatment: 'Imagery', ratio: '1:1' },
  { id: 'w11', media: 'image', treatment: 'Ad creative', ratio: '4:5' },
  { id: 'w12', media: 'video', treatment: 'Demo', ratio: '9:16' },
];

export const STUDIO_MAKE = {
  eyebrow: 'What we make',
  title: 'Four kinds of content,',
  emphasis: 'built around what you sell.',
  items: [
    {
      index: '01',
      title: 'Videos and animated explainers',
      body: 'Short loops and longer cuts that show what you sell, how it works and why someone would want it. Made for product pages, service pages, launches and social.',
      treatments: ['Video', 'Explainer'] as Treatment[],
    },
    {
      index: '02',
      title: 'Imagery and styled shoots',
      body: 'Product shots, lifestyle scenes and finished-room visuals without booking a studio or waiting for the job to be photographed, kept consistent across everything you sell.',
      treatments: ['Styled shoot', 'Imagery'] as Treatment[],
    },
    {
      index: '03',
      title: 'Ad creative and variations',
      body: 'One idea cut many ways: new hooks, formats and aspect ratios, so there is always fresh creative to test without starting from scratch.',
      treatments: ['Ad creative'] as Treatment[],
    },
    {
      index: '04',
      title: 'Demos and walkthroughs',
      body: 'Software demos, product walkthroughs and how a service works, step by step, so a visitor understands what they are buying before they ask.',
      treatments: ['Demo'] as Treatment[],
    },
  ],
} as const;

export const STUDIO_PROCESS = {
  eyebrow: 'Process',
  title: 'Three steps,',
  emphasis: 'and the sample is free.',
  steps: [
    {
      index: '01',
      title: 'Share what you sell.',
      body: 'Send us a link to a product, a feature or a service page, and a line about your business. That is all we need to start.',
    },
    {
      index: '02',
      title: 'We create a free sample.',
      body: 'A short video or a small set of images, made for that product or service in your brand’s look. No cost and no commitment.',
    },
    {
      index: '03',
      title: 'If you like it, we can create more.',
      body: 'If the sample is useful, we talk about a range, a launch or ongoing ad creative. If it is not, there is nothing to cancel.',
    },
  ],
} as const;

export const BUSINESS_OPTIONS = [
  { value: 'ecommerce', label: 'Ecommerce' },
  { value: 'saas', label: 'B2B software' },
  { value: 'home-improvement', label: 'Home improvement' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'other', label: 'Something else' },
] as const;

export const STUDIO_SAMPLE = {
  eyebrow: 'Free sample',
  title: 'Get a free sample',
  emphasis: 'for what you sell.',
  lead: 'Tell us what you sell and what you would like to see. We will make a short video or a set of images for it, free.',
  points: [
    'Free, with no purchase required',
    'One product or service, your choice',
    'No contract and no card details',
  ],
  windowTitle: 'free-sample',
  fields: {
    name: 'Your name',
    email: 'Work email',
    brand: 'Company or website',
    brandHint: 'Your business name or your website’s address',
    business: 'Your business',
    businessPlaceholder: 'Choose one',
    productUrl: 'Page to feature',
    productUrlHint: 'A link to the product, feature or service you want the sample made for',
    preference: 'Preferred sample',
  },
  submit: 'Request my free sample',
  sending: 'Sending',
  fineprint: 'We use these details only to make your sample and to contact you about it.',
  privacy: 'Privacy notice',
  success: {
    title: 'Request received.',
    body: 'Thank you. We will be in touch by email about your sample.',
    reference: 'Your reference',
  },
  unconfigured: {
    title: 'Requests are not connected yet.',
    body: 'This form is switched off until a delivery address is configured, so nothing you enter here would be sent.',
  },
  errors: {
    name: 'Enter your name, at least two characters.',
    email: 'Enter a valid work email address.',
    brand: 'Enter your business name or website.',
    business: 'Choose the kind of business you run.',
    productUrl: 'Enter the full address of the page to feature.',
    preference: 'Choose a video or images.',
    generic: 'Some details need correcting before this can be sent.',
    network: 'The request could not be sent. Check your connection and try again.',
  },
} as const;

export const STUDIO_FOOTER = {
  /** Set across the footer, the second word in purple. */
  wordmark: ['The Grow', 'Label'],
  line: 'AI video, imagery and ad creative for businesses that sell.',
  legal: [
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
  ],
} as const;
