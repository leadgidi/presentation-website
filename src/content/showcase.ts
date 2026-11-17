import type { AppIconName } from '@/components/app-icon';

export type ShowcasePerson = {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
};

type NavigationItem = { label: string; icon: AppIconName };

export const showcase = {
  caption: 'Leadgidi Enrich turning a name and a company into a verified work email',
  people: [
    { firstName: 'Ana', lastName: 'Ionescu', company: 'Corvel Freight', email: 'ana.ionescu@corvelfreight.com' },
    {
      firstName: 'Marcus',
      lastName: 'Lindqvist',
      company: 'Brightwater Analytics',
      email: 'mlindqvist@brightwateranalytics.io',
    },
    { firstName: 'Sofia', lastName: 'Marín', company: 'Tallis Robotics', email: 'sofia@tallisrobotics.com' },
  ] satisfies ShowcasePerson[],
};

export const appPreview = {
  workspace: 'Leadgidi',
  navigation: [
    {
      title: 'Enrich',
      items: [
        { label: 'Enrich a file', icon: 'fileUp' },
        { label: 'Interactive enrich', icon: 'userSearch' },
        { label: 'In progress', icon: 'loader' },
        { label: 'History', icon: 'history' },
      ] satisfies NavigationItem[],
    },
    {
      title: 'Developers',
      items: [
        { label: 'API keys', icon: 'keyRound' },
        { label: 'Documentation', icon: 'bookOpen' },
        { label: 'Integrations', icon: 'plug' },
      ] satisfies NavigationItem[],
    },
  ],
  activeItem: 'Interactive enrich',
  credits: { label: 'Credits', value: '4,820', unit: 'available', action: 'Buy credits' },
  user: { initials: 'AM', name: 'Alex Morgan', email: 'alex@northfield.co' },
  breadcrumb: 'Enrichment',
  headerLinks: [
    { label: 'Docs', icon: 'bookOpen' },
    { label: 'Support', icon: 'lifeBuoy' },
  ] satisfies NavigationItem[],
  title: 'Interactive enrich',
  description: 'Find work emails and phone numbers for people you already know',
  submit: 'Enrich',
  rowNumber: '1',
  placeholders: ['First name', 'Last name', 'Company', 'Website (optional)'],
  addPerson: 'Add another person',
  limit: '1 person / 25 people',
  recent: 'Recent',
  viewAll: 'View all',
  columns: ['Name', 'Company', 'Email', 'Status'],
  status: { searching: 'Enriching', found: 'Found' },
  history: [
    { firstName: 'Helena', lastName: 'Brandt', company: 'Nordmark Energy', email: 'helena.brandt@nordmarkenergy.de' },
    { firstName: 'Ravi', lastName: 'Menon', company: 'Lumen Ledger', email: 'rmenon@lumenledger.com' },
    { firstName: 'Lucía', lastName: 'Ferrer', company: 'Arden Mobility', email: 'lucia.ferrer@ardenmobility.com' },
  ] satisfies ShowcasePerson[],
};
