import { sectionIds, site } from '@/content/site';

export const hero = {
  title: 'Turn names into verified work emails.',
  lede: 'Send a name and company, get the work email, phone and title we can find.',
  backdrop: {
    mountain: { src: '/hero/mountain-ridge.webp', width: 3200, height: 2134 },
    smoke: '/hero/smoke.webp',
  },
};

export const whatYouGet = {
  id: sectionIds.product,
  title: 'Email, phone, title and company in one record.',
  lede: 'Full B2B contact enrichment, in one run.',
  points: ['Verified work email, catch-all flagged', 'Job title, phones and LinkedIn', 'Company website, country and size'],
  record: {
    caption: 'Example record',
    request: 'Helena Brandt, Nordmark Energy',
    searchingLabel: 'Enriching contact...',
    resultLabel: 'Found 1 contact',
    name: 'Helena Brandt',
    photo: { src: '/people/helena-brandt.webp', size: 48 },
    role: 'Head of Procurement, Nordmark Energy',
    badge: 'Email verified',
    rows: [
      { label: 'Work email', value: 'helena.brandt@nordmarkenergy.de', isWide: true },
      { label: 'Work phone', value: '+49 30 5550 1842' },
      { label: 'LinkedIn', value: 'in/helena-brandt' },
      { label: 'Website', value: 'nordmarkenergy.de' },
      { label: 'Country', value: 'Germany' },
      { label: 'Employees', value: '340' },
    ],
  },
};

export const payPerResult = {
  title: 'Only pay for what we find.',
  lede: 'No match, no charge. Credits come back automatically.',
  body: "Each contact costs one credit when found. Credits for contacts we can't find come back when the run ends.",
  feed: {
    photoSize: 32,
    caption: 'Example results: found contacts cost one credit, contacts with no match are refunded',
    foundLabel: 'found',
    missedLabel: 'no match',
    chargedLabel: '1 credit',
    refundedLabel: 'Refunded',
    people: [
      { name: 'Helena Brandt', photo: '/people/helena-brandt.webp', isFound: true },
      { name: 'Jonas Weber', isFound: false },
      { name: 'Ravi Menon', photo: '/people/ravi-menon.webp', isFound: true },
      { name: 'Lucía Ferrer', photo: '/people/lucia-ferrer.webp', isFound: true },
      { name: 'Tom Okafor', isFound: false },
      { name: 'Ana Ionescu', photo: '/people/ana-ionescu.webp', isFound: true },
      { name: 'Marta Kowalska', photo: '/people/marta-kowalska.webp', isFound: true },
      { name: 'Pieter de Vries', isFound: false },
      { name: 'Sofia Lindqvist', photo: '/people/sofia-lindqvist.webp', isFound: true },
      { name: 'Daniel Ortiz', photo: '/people/daniel-ortiz.webp', isFound: true },
      { name: 'Claire Dubois', isFound: false },
      { name: 'Kenji Watanabe', photo: '/people/kenji-watanabe.webp', isFound: true },
    ],
  },
};

export const waysIn = {
  id: sectionIds.developers,
  title: 'Three ways to send contacts.',
  lede: 'Type a few names, upload a list or call the API.',
  ways: [
    {
      icon: 'web' as const,
      name: 'Web app',
      title: 'Enrich a few people in seconds',
      body: 'Type a name and company, up to 25 people at a time, and watch results arrive live.',
      windowTitle: 'Interactive Enrichment',
    },
    {
      icon: 'file' as const,
      name: 'File upload',
      title: 'Send a whole list at once',
      body: 'Upload CSV, NDJSON or ZIP up to 512 MB and get the same format back, enriched.',
      windowTitle: 'File Enrichment',
    },
    {
      icon: 'api' as const,
      name: 'REST API',
      title: 'Build enrichment into your product',
      body: 'Send up to 2,500 people per request, with idempotency keys for safe retries.',
      windowTitle: 'POST /enrichments',
    },
  ],
  webPreview: {
    name: 'Ana Ionescu',
    company: 'Corvel Freight',
    submit: 'Enrich',
    foundLabel: 'Found',
    missedLabel: 'No match',
    photoSize: 32,
    results: [
      { name: 'Ana Ionescu', detail: 'ana.ionescu@corvelfreight.com', photo: '/people/ana-ionescu.webp', isFound: true },
      { name: 'Helena Brandt', detail: 'helena.brandt@nordmarkenergy.de', photo: '/people/helena-brandt.webp', isFound: true },
      { name: 'Jonas Weber', detail: 'Kessler Tools', isFound: false },
      { name: 'Lucía Ferrer', detail: 'lucia.ferrer@ardenmobility.com', photo: '/people/lucia-ferrer.webp', isFound: true },
    ],
  },
  filePreview: {
    fileName: 'q3-prospects.csv',
    columnLetters: ['A', 'B', 'C'],
    headerRowNumber: 1,
    columns: ['name', 'company', 'work_email'],
    missingLabel: 'no match',
    rows: [
      { name: 'Helena Brandt', company: 'Nordmark Energy', email: 'helena.brandt@nordmarkenergy.de' },
      { name: 'Jonas Weber', company: 'Kessler Tools', email: '' },
      { name: 'Ravi Menon', company: 'Lumen Ledger', email: 'rmenon@lumenledger.com' },
      { name: 'Lucía Ferrer', company: 'Arden Mobility', email: 'lucia.ferrer@ardenmobility.com' },
      { name: 'Ana Ionescu', company: 'Corvel Freight', email: 'ana.ionescu@corvelfreight.com' },
    ],
  },
  code: {
    label: 'Example API response for an enrichment entry',
    method: 'GET',
    path: '/enrichments/{id}/entries',
    status: '200 OK',
    body: `{
  "entries": [{
    "outcome": {
      "status": "FOUND",
      "person": {
        "name": "Ana Ionescu",
        "jobs": [{
          "company": { "name": "Corvel Freight" },
          "email": {
            "address": "ana.ionescu@corvelfreight.com",
            "isCatchAll": false
          }
        }]
      }
    }
  }]
}`,
  },
};

export const pricingCopy = {
  id: sectionIds.pricing,
  title: 'Start free, then buy credits as you need them.',
  lede: 'One credit per contact found.',
  billingLegend: 'Billing',
  creditsLabel: 'Credits',
  perContact: 'per contact found',
  creditsIncluded: 'credits',
  freePrice: '$0',
  freeCreditsSuffix: 'credits included',
  planDetailsLabel: 'Plan details',
  upcomingLabel: 'Coming soon',
  recommendedLabel: 'Recommended',
  buyCreditsFeature: 'Buy more credits, once or by subscription',
  includedLabel: 'Included',
  notIncludedLabel: 'Not included',
  freeCta: site.primaryCta,
  paidCta: (planLabel: string) => `Choose ${planLabel}`,
};

export const faq = {
  id: sectionIds.faq,
  title: 'Questions about data, credits and files.',
  items: [
    {
      question: 'What do I need to send for each person?',
      answer: 'A full name and a company name. If you have the company website, include it and we skip the company lookup.',
    },
    {
      question: 'Where does the data come from?',
      answer:
        'From the public web: search results and company websites. We find the company domain, build the likely addresses and check them with its mail server, or use an address the company published itself.',
    },
    {
      question: 'What is a catch-all email?',
      answer:
        'Some mail servers accept every address, so no email on that domain can be confirmed. When we still return one, it is marked as catch-all so you can decide how to use it.',
    },
    {
      question: 'Which files can I upload?',
      answer: 'CSV, NDJSON or ZIP files up to 512 MB. You get the same format back, enriched.',
    },
    {
      question: 'Do you have an API?',
      answer:
        'Yes. The REST API takes up to 2,500 people per request with an API key, and idempotency keys make retries safe. Results come back in the same order you sent them.',
    },
    {
      question: 'When is a credit used?',
      answer:
        'Only when we return a work email or phone number for that person. We reserve one credit per person when a run starts, so your balance needs to cover the whole list, and refund everyone we could not find when it finishes.',
    },
    {
      question: 'Do credits expire?',
      answer:
        'Credits stay valid for at least a year after you buy them. On a subscription they stay valid while it renews, plus 7 days after it ends. Unused credits carry over, and every purchase extends all of them.',
    },
    {
      question: 'Can I cancel my subscription?',
      answer:
        'Yes, from the billing portal in your account. Credits you already have stay valid for at least 7 days after it ends.',
    },
  ],
};

export const closing = {
  title: (freeCredits: string) => `Your first ${freeCredits} contacts are on us.`,
  lede: 'Create an account, upload a list and see what comes back.',
  contactCta: 'Email us',
};
