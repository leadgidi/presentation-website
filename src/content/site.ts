export const site = {
  company: 'Leadgidi',
  product: 'Leadgidi Enrich',
  contactEmail: 'contact@leadgidi.com',
  url: 'https://leadgidi.com',
  seoTitle: 'Leadgidi Enrich: B2B contact enrichment with verified emails',
  seoDescription:
    'Leadgidi Enrich turns a name and a company into a verified work email, phone number and job title. Built for B2B sales teams. Coming soon, join the waitlist.',
  copyright: `\u00a9 ${new Date().getFullYear()} Leadgidi. All rights reserved.`,
  headline: 'Every contact, completed.',
  taglines: [
    'Name and company in. Verified email, phone and title out.',
    'A list of names in. A list of people you can reach out.',
    'LinkedIn profile in. Work email and direct phone out.',
    'Pay only for the emails we actually find.',
  ],
  comingSoon: 'Coming soon. Join the waitlist.',
};

export const waitlistCopy = {
  placeholder: 'Email',
  submit: 'Join the waitlist',
  joined: 'You are on the list.',
  invalidEmail: 'Enter a valid email address.',
  tooMany: 'Too many attempts. Try again in an hour.',
  notOpen: `The waitlist is not open yet. Write to ${site.contactEmail}.`,
  failed: `Could not save your email. Try again or write to ${site.contactEmail}.`,
};
