const APP_URL = 'https://app.leadgidi.com';
const CONTACT_EMAIL = 'contact@leadgidi.com';
const PRIMARY_CTA = 'Start for free';
const SIGN_IN = 'Sign in';
const SIGNUP_URL = `${APP_URL}/signup/`;
const SIGN_IN_URL = `${APP_URL}/login/`;

export const sectionIds = { product: 'what-you-get', developers: 'ways-in', pricing: 'pricing', faq: 'faq' };

const anchor = (id: string) => `#${id}`;

export const site = {
  company: 'Leadgidi',
  product: 'Leadgidi Enrich',
  contactEmail: CONTACT_EMAIL,
  domain: 'leadgidi.com',
  url: 'https://leadgidi.com',
  signupUrl: SIGNUP_URL,
  signInUrl: SIGN_IN_URL,
  checkout: { path: '/dashboard/plans/checkout/', returnParam: 'next' },
  brand: {
    lockup: '/brand/leadgidi-lockup-black.svg',
    markPng: '/brand/leadgidi-mark-black-1024.png',
  },
  seoTitle: 'Leadgidi Enrich: B2B contact enrichment with verified emails',
  seoDescription:
    'Leadgidi Enrich turns a name and a company into a verified work email, phone number and job title. Pay only for contacts we find.',
  copyright: `© ${new Date().getFullYear()} Leadgidi. All rights reserved.`,
  signIn: SIGN_IN,
  navigationLabel: 'Primary',
  mobileNavigationLabel: 'Menu',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  primaryCta: PRIMARY_CTA,
  secondaryCta: { label: 'See pricing', href: anchor(sectionIds.pricing) },
  skipToContent: 'Skip to content',
  footerLabel: 'Footer',
  footerColumns: [
    {
      title: 'Product',
      links: [
        { label: 'What you get', href: anchor(sectionIds.product) },
        { label: 'Developers', href: anchor(sectionIds.developers) },
        { label: 'Pricing', href: anchor(sectionIds.pricing) },
        { label: 'FAQ', href: anchor(sectionIds.faq) },
      ],
    },
    {
      title: 'Account',
      links: [
        { label: PRIMARY_CTA, href: SIGNUP_URL },
        { label: SIGN_IN, href: SIGN_IN_URL },
      ],
    },
    {
      title: 'Contact',
      links: [{ label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` }],
    },
  ],
  navigation: [
    { label: 'Product', href: anchor(sectionIds.product) },
    { label: 'Pricing', href: anchor(sectionIds.pricing) },
    { label: 'Developers', href: anchor(sectionIds.developers) },
    { label: 'FAQ', href: anchor(sectionIds.faq) },
  ],
};
