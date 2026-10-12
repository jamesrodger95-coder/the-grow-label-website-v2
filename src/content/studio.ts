/**
 * /AI: the content studio.
 *
 * A separate offering from the revenue-recovery site: AI-made video, imagery
 * and ad creative for businesses that sell something, whether that is a
 * product, software or a service. The first audiences are ecommerce brands,
 * software, home improvement, construction and the trades, and more. The
 * page is reached from cold outreach that offers a free sample. Every word on
 * it lives here, in the same way the rest of the site keeps copy out of routes.
 *
 * Two rules carry over unchanged from the main site:
 *
 *   - No invented evidence. No client names, results, uplift figures or
 *     testimonials. The work is shown as work; it is never presented as proof
 *     that it sold anything.
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
  'Software',
  'Home improvement',
  'Construction',
  'HVAC',
  'Plumbing',
  'Electrical',
  'Roofing',
  'Solar',
  'Landscaping',
  'Real estate',
  'Beauty and skincare',
  'Fashion',
  'Food and drink',
  'Health and wellness',
  'Fitness',
  'Automotive',
  'Hospitality',
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
  showAll: 'Show all the work',
  viewer: {
    close: 'Close',
    previous: 'Previous piece',
    next: 'Next piece',
    of: 'of',
  },
} as const;

/** One piece in the showcase collage, by its portfolio id. */
export type ShowcasePiece = {
  id: string;
  /** What the format is, shown on the piece. */
  tag: string;
  /** Final position: centre x and y as % of the stage, width as % of it. */
  x: number;
  y: number;
  w: number;
  /** Final tilt in degrees, and how far it floats (0 to 1, back to front). */
  r: number;
  depth: number;
  /** Position on a phone, or null to leave it out there. */
  m: { x: number; y: number; w: number } | null;
};

/**
 * "Whatever you sell": the work itself, flown out of a stack into a layered
 * collage as the section scrolls in. A widescreen film at the centre, reels in
 * phone frames, feed posts tucked between, so the three formats read at once.
 */
export const STUDIO_SHOWCASE = {
  eyebrow: 'Industries',
  title: 'Whatever you sell,',
  emphasis: 'it can look this good.',
  lead: 'Reels for the feed, squares for the grid, widescreen for the site and the launch. One studio, every format, built around what you sell.',
  forLabel: 'Made for',
  label:
    'A collage of the studio’s work in three formats: vertical reels, square feed posts and widescreen films.',
  legend: [
    { ratio: '9:16', label: 'Reels and stories' },
    { ratio: '1:1', label: 'Feed posts' },
    { ratio: '16:9', label: 'Site, launch and YouTube' },
  ],
  pieces: [
    {
      id: 'w05',
      tag: 'Launch film',
      x: 50,
      y: 50,
      w: 36,
      r: 0,
      depth: 0.2,
      m: { x: 50, y: 22, w: 92 },
    },
    { id: 'w01', tag: 'Feature demo', x: 19, y: 19, w: 20, r: -4, depth: 0.5, m: null },
    { id: 'w22', tag: 'YouTube ad', x: 81, y: 18, w: 19, r: 4, depth: 0.6, m: null },
    { id: 'w44', tag: 'Website hero', x: 23, y: 83, w: 18, r: 3, depth: 0.8, m: null },
    { id: 'w46', tag: 'LinkedIn ad', x: 78, y: 84, w: 18, r: -3, depth: 0.7, m: null },
    {
      id: 'w02',
      tag: 'TikTok ad',
      x: 7.5,
      y: 52,
      w: 10,
      r: -6,
      depth: 1,
      m: { x: 21, y: 70, w: 34 },
    },
    { id: 'w49', tag: 'Property listing', x: 35, y: 15, w: 9, r: 3, depth: 0.9, m: null },
    { id: 'w48', tag: 'Facebook ad', x: 63, y: 86, w: 10, r: -3, depth: 0.9, m: null },
    {
      id: 'w13',
      tag: 'Paid social',
      x: 92.5,
      y: 50,
      w: 10,
      r: 6,
      depth: 1,
      m: { x: 79, y: 70, w: 34 },
    },
    { id: 'w39', tag: 'Product image', x: 50, y: 12, w: 9, r: -2, depth: 0.7, m: null },
    { id: 'w53', tag: 'Instagram post', x: 25.5, y: 50, w: 9, r: -5, depth: 0.8, m: null },
    {
      id: 'w51',
      tag: 'Paid social',
      x: 74.5,
      y: 50,
      w: 9,
      r: 5,
      depth: 0.8,
      m: { x: 50, y: 82, w: 36 },
    },
  ] satisfies ShowcasePiece[],
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
  ratio: '9:16' | '2:3' | '4:5' | '3:4' | '4:3' | '3:2' | '1:1' | '16:9';
  /** Filled in when the file arrives. Never before. */
  title?: string;
  /** What was being sold, e.g. "Skincare" or "HVAC". Filled in with the file. */
  category?: string;
  credit?: Credit;
};

/**
 * Every piece is labelled "Concept work" until the business it was made for
 * has agreed to be named; then its credit becomes { kind: 'client', brand }.
 */
const CONCEPT: Credit = { kind: 'concept' };

/**
 * The portfolio, in display order.
 *
 * w01 to w35 are the studio's films and w36 to w53 its stills, all
 * imported by scripts/studio-import.py (films at 720p and at most 20 seconds,
 * stills at 1600 px). Every one of them is also a tile in the hero tunnel.
 * Listed in display order, not id order: the first twelve (shown before
 * "Show all") are picked to span the industries, not just software.
 */
export const WORK: WorkEntry[] = [
  {
    id: 'w44',
    media: 'image',
    treatment: 'Ad creative',
    ratio: '16:9',
    title: 'The Estates: a world of your own',
    category: 'Real estate',
    credit: CONCEPT,
  },
  {
    id: 'w01',
    media: 'video',
    treatment: 'Demo',
    ratio: '16:9',
    title: 'Muse: connect and track',
    category: 'Software',
    credit: CONCEPT,
  },
  {
    id: 'w48',
    media: 'image',
    treatment: 'Ad creative',
    ratio: '4:5',
    title: 'Apex Roofing: built to last',
    category: 'Roofing',
    credit: CONCEPT,
  },
  {
    id: 'w05',
    media: 'video',
    treatment: 'Video',
    ratio: '16:9',
    title: 'Every photo has a better version',
    category: 'Photo app',
    credit: CONCEPT,
  },
  {
    id: 'w39',
    media: 'image',
    treatment: 'Imagery',
    ratio: '1:1',
    title: 'Leather tote, studio',
    category: 'Fashion',
    credit: CONCEPT,
  },
  {
    id: 'w46',
    media: 'image',
    treatment: 'Ad creative',
    ratio: '16:9',
    title: 'Formwork: the next business landmark',
    category: 'Construction',
    credit: CONCEPT,
  },
  {
    id: 'w02',
    media: 'video',
    treatment: 'Ad creative',
    ratio: '9:16',
    title: 'sweetRegret: your lineup, your order',
    category: 'Food and drink',
    credit: CONCEPT,
  },
  {
    id: 'w52',
    media: 'image',
    treatment: 'Ad creative',
    ratio: '1:1',
    title: 'Make room for better',
    category: 'Home improvement',
    credit: CONCEPT,
  },
  {
    id: 'w31',
    media: 'video',
    treatment: 'Video',
    ratio: '16:9',
    title: 'Cinetic: now it directs',
    category: 'Developer tools',
    credit: CONCEPT,
  },
  {
    id: 'w45',
    media: 'image',
    treatment: 'Ad creative',
    ratio: '3:2',
    title: 'Villa collection, two posters',
    category: 'Real estate',
    credit: CONCEPT,
  },
  {
    id: 'w13',
    media: 'video',
    treatment: 'Video',
    ratio: '9:16',
    title: 'Lightspark: the TCP/IP of money',
    category: 'Fintech',
    credit: CONCEPT,
  },
  {
    id: 'w53',
    media: 'image',
    treatment: 'Ad creative',
    ratio: '1:1',
    title: 'Built for the long haul',
    category: 'Tools and trades',
    credit: CONCEPT,
  },
  {
    id: 'w03',
    media: 'video',
    treatment: 'Ad creative',
    ratio: '16:9',
    title: 'AI influencers, marketing your app',
    category: 'Marketing software',
    credit: CONCEPT,
  },
  {
    id: 'w04',
    media: 'video',
    treatment: 'Video',
    ratio: '1:1',
    title: 'Lidlezz: lid closed, still working',
    category: 'Software',
    credit: CONCEPT,
  },
  {
    id: 'w06',
    media: 'video',
    treatment: 'Demo',
    ratio: '9:16',
    title: 'PicTwin: change anything in plain words',
    category: 'AI app',
    credit: CONCEPT,
  },
  {
    id: 'w07',
    media: 'video',
    treatment: 'Video',
    ratio: '16:9',
    title: 'Réservez votre vol',
    category: 'Travel',
    credit: CONCEPT,
  },
  {
    id: 'w08',
    media: 'video',
    treatment: 'Demo',
    ratio: '16:9',
    title: 'FigPad: sketch to scientific figure',
    category: 'Research software',
    credit: CONCEPT,
  },
  {
    id: 'w09',
    media: 'video',
    treatment: 'Video',
    ratio: '9:16',
    title: 'Mew: less mental load',
    category: 'Family app',
    credit: CONCEPT,
  },
  {
    id: 'w10',
    media: 'video',
    treatment: 'Ad creative',
    ratio: '16:9',
    title: 'Your next ad is one hook away',
    category: 'Ad tech',
    credit: CONCEPT,
  },
  {
    id: 'w11',
    media: 'video',
    treatment: 'Explainer',
    ratio: '1:1',
    title: 'Negroni, step by step',
    category: 'Drinks',
    credit: CONCEPT,
  },
  {
    id: 'w12',
    media: 'video',
    treatment: 'Explainer',
    ratio: '16:9',
    title: 'Claim the job',
    category: 'Workflow software',
    credit: CONCEPT,
  },
  {
    id: 'w14',
    media: 'video',
    treatment: 'Video',
    ratio: '16:9',
    title: 'FundMyCompute',
    category: 'Fintech',
    credit: CONCEPT,
  },
  {
    id: 'w15',
    media: 'video',
    treatment: 'Video',
    ratio: '16:9',
    title: 'Double It: provably fair',
    category: 'Gaming',
    credit: CONCEPT,
  },
  {
    id: 'w16',
    media: 'video',
    treatment: 'Demo',
    ratio: '9:16',
    title: 'ocrX: handwriting to text',
    category: 'Mobile app',
    credit: CONCEPT,
  },
  {
    id: 'w17',
    media: 'video',
    treatment: 'Demo',
    ratio: '16:9',
    title: 'Bento: tell your agent',
    category: 'AI software',
    credit: CONCEPT,
  },
  {
    id: 'w18',
    media: 'video',
    treatment: 'Demo',
    ratio: '16:9',
    title: 'Clean the list before you send',
    category: 'Email software',
    credit: CONCEPT,
  },
  {
    id: 'w19',
    media: 'video',
    treatment: 'Explainer',
    ratio: '1:1',
    title: 'Token bucket, explained',
    category: 'Developer tools',
    credit: CONCEPT,
  },
  {
    id: 'w20',
    media: 'video',
    treatment: 'Video',
    ratio: '16:9',
    title: 'Mil listas, sob medida',
    category: 'Lifestyle app',
    credit: CONCEPT,
  },
  {
    id: 'w21',
    media: 'video',
    treatment: 'Ad creative',
    ratio: '9:16',
    title: "Primavera Sound '26 line-up",
    category: 'Events',
    credit: CONCEPT,
  },
  {
    id: 'w22',
    media: 'video',
    treatment: 'Ad creative',
    ratio: '16:9',
    title: 'We buy upfront',
    category: 'Ecommerce finance',
    credit: CONCEPT,
  },
  {
    id: 'w23',
    media: 'video',
    treatment: 'Demo',
    ratio: '16:9',
    title: 'Order by craving',
    category: 'Food delivery',
    credit: CONCEPT,
  },
  {
    id: 'w24',
    media: 'video',
    treatment: 'Explainer',
    ratio: '16:9',
    title: 'Watch every idea get drawn',
    category: 'Education',
    credit: CONCEPT,
  },
  {
    id: 'w25',
    media: 'video',
    treatment: 'Ad creative',
    ratio: '9:16',
    title: 'Overthinking',
    category: 'Music',
    credit: CONCEPT,
  },
  {
    id: 'w26',
    media: 'video',
    treatment: 'Demo',
    ratio: '16:9',
    title: 'Client intake, answered by AI',
    category: 'Software',
    credit: CONCEPT,
  },
  {
    id: 'w27',
    media: 'video',
    treatment: 'Ad creative',
    ratio: '16:9',
    title: 'UGC video, made to order',
    category: 'AI video app',
    credit: CONCEPT,
  },
  {
    id: 'w28',
    media: 'video',
    treatment: 'Video',
    ratio: '16:9',
    title: 'A day in motion',
    category: 'Mobile game',
    credit: CONCEPT,
  },
  {
    id: 'w29',
    media: 'video',
    treatment: 'Video',
    ratio: '16:9',
    title: 'Field-bearing assets',
    category: 'Agriculture',
    credit: CONCEPT,
  },
  {
    id: 'w30',
    media: 'video',
    treatment: 'Video',
    ratio: '16:9',
    title: 'Type in motion',
    category: 'Brand',
    credit: CONCEPT,
  },
  {
    id: 'w32',
    media: 'video',
    treatment: 'Demo',
    ratio: '16:9',
    title: 'AjustaCV Pro, plan by plan',
    category: 'Software',
    credit: CONCEPT,
  },
  {
    id: 'w33',
    media: 'video',
    treatment: 'Demo',
    ratio: '16:9',
    title: 'New for you: a music player',
    category: 'Music app',
    credit: CONCEPT,
  },
  {
    id: 'w34',
    media: 'video',
    treatment: 'Demo',
    ratio: '4:3',
    title: 'Badges: Early Explorer',
    category: 'Mobile app',
    credit: CONCEPT,
  },
  {
    id: 'w35',
    media: 'video',
    treatment: 'Ad creative',
    ratio: '9:16',
    title: 'Onde fica o boteco?',
    category: 'Food and drink',
    credit: CONCEPT,
  },
  {
    id: 'w36',
    media: 'image',
    treatment: 'Imagery',
    ratio: '1:1',
    title: 'Fragrance, spotlit',
    category: 'Fragrance',
    credit: CONCEPT,
  },
  {
    id: 'w37',
    media: 'image',
    treatment: 'Styled shoot',
    ratio: '4:3',
    title: 'Skincare, styled set',
    category: 'Skincare',
    credit: CONCEPT,
  },
  {
    id: 'w38',
    media: 'image',
    treatment: 'Styled shoot',
    ratio: '4:3',
    title: 'Sunscreen, product and on-model',
    category: 'Skincare',
    credit: CONCEPT,
  },
  {
    id: 'w40',
    media: 'image',
    treatment: 'Styled shoot',
    ratio: '1:1',
    title: 'Sun cream, on-model',
    category: 'Skincare',
    credit: CONCEPT,
  },
  {
    id: 'w41',
    media: 'image',
    treatment: 'Styled shoot',
    ratio: '1:1',
    title: 'Serum on stone',
    category: 'Skincare',
    credit: CONCEPT,
  },
  {
    id: 'w42',
    media: 'image',
    treatment: 'Imagery',
    ratio: '16:9',
    title: "L'Or d'Ambre, two settings",
    category: 'Fragrance',
    credit: CONCEPT,
  },
  {
    id: 'w43',
    media: 'image',
    treatment: 'Styled shoot',
    ratio: '4:5',
    title: 'Fragrance on travertine',
    category: 'Fragrance',
    credit: CONCEPT,
  },
  {
    id: 'w47',
    media: 'image',
    treatment: 'Ad creative',
    ratio: '3:2',
    title: 'Forge: serious tools, serious work',
    category: 'Tools and trades',
    credit: CONCEPT,
  },
  {
    id: 'w49',
    media: 'image',
    treatment: 'Ad creative',
    ratio: '2:3',
    title: 'Private villas: space to live',
    category: 'Real estate',
    credit: CONCEPT,
  },
  {
    id: 'w50',
    media: 'image',
    treatment: 'Styled shoot',
    ratio: '4:5',
    title: 'Freestanding bath tap, styled',
    category: 'Home and bathroom',
    credit: CONCEPT,
  },
  {
    id: 'w51',
    media: 'image',
    treatment: 'Ad creative',
    ratio: '4:5',
    title: 'From groundwork to greatness',
    category: 'Construction',
    credit: CONCEPT,
  },
  {
    id: 'w54',
    media: 'video',
    treatment: 'Ad creative',
    ratio: '9:16',
    title: 'Leather wallet: lightweight, hand stitched',
    category: 'Leather goods',
    credit: CONCEPT,
  },
  {
    id: 'w55',
    media: 'video',
    treatment: 'Ad creative',
    ratio: '9:16',
    title: 'Which look: one outfit, five ways',
    category: 'Fashion',
    credit: CONCEPT,
  },
  {
    id: 'w56',
    media: 'video',
    treatment: 'Ad creative',
    ratio: '9:16',
    title: 'Four palettes: one fit, four colourways',
    category: 'Fashion',
    credit: CONCEPT,
  },
  {
    id: 'w57',
    media: 'video',
    treatment: 'Ad creative',
    ratio: '16:9',
    title: 'Malarkey: shingles built to do more',
    category: 'Roofing',
    credit: CONCEPT,
  },
  {
    id: 'w58',
    media: 'video',
    treatment: 'Ad creative',
    ratio: '16:9',
    title: 'Modus Projects: anders denken',
    category: 'Home renovation',
    credit: CONCEPT,
  },
  {
    id: 'w59',
    media: 'video',
    treatment: 'Ad creative',
    ratio: '16:9',
    title: 'Tandem: built together',
    category: 'Construction',
    credit: CONCEPT,
  },
  {
    id: 'w60',
    media: 'video',
    treatment: 'Ad creative',
    ratio: '16:9',
    title: 'Bollano Plumbers: when you think plumbing',
    category: 'Plumbing',
    credit: CONCEPT,
  },
  {
    id: 'w61',
    media: 'video',
    treatment: 'Ad creative',
    ratio: '16:9',
    title: 'SPS: same-day plumbing, three ways',
    category: 'Plumbing',
    credit: CONCEPT,
  },
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
  { value: 'software', label: 'Software' },
  { value: 'home-improvement', label: 'Home improvement' },
  { value: 'construction', label: 'Construction' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'roofing-solar', label: 'Roofing and solar' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'real-estate', label: 'Real estate' },
  { value: 'beauty', label: 'Beauty and skincare' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'food-drink', label: 'Food and drink' },
  { value: 'health-fitness', label: 'Health and fitness' },
  { value: 'other', label: 'Something else' },
] as const;

export const STUDIO_SAMPLE = {
  eyebrow: 'Free sample',
  title: 'Get a free sample',
  emphasis: 'for what you sell.',
  lead: 'Pick a time for a short call. Tell us what you sell and what you would like to see, and we will make a short video or a set of images for it, free.',
  /** The Cal.com event the free-sample call is booked on. */
  bookingUrl: 'https://cal.com/thegrowlabel/proposal-discussion',
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
