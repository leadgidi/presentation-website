export type ShowcasePerson = {
  name: string;
  company: string;
  email: string;
};

export const showcase = {
  caption: 'Leadgidi Enrich turning a name and a company into a verified work email',
  people: [
    {
      name: 'Ana Ionescu',
      company: 'Corvel Freight',
      email: 'ana.ionescu@corvelfreight.com',
    },
    {
      name: 'Marcus Lindqvist',
      company: 'Brightwater Analytics',
      email: 'mlindqvist@brightwateranalytics.io',
    },
    {
      name: 'Sofia Marín',
      company: 'Tallis Robotics',
      email: 'sofia@tallisrobotics.com',
    },
  ] satisfies ShowcasePerson[],
};

export const appPreview = {
  workspace: 'Leadgidi',
  workspaceInitial: 'L',
  sidebar: ['Enrichment', 'API Console', 'Documentation'],
  activeItem: 'Enrichment',
  title: 'Interactive Enrichment',
  placeholders: ['Name', 'Company'],
  submit: 'Enrich',
  columns: ['Name', 'Company', 'Email', 'Status'],
  status: { searching: 'Searching', found: 'Found' },
  history: [
    { name: 'Helena Brandt', company: 'Nordmark Energy', email: 'helena.brandt@nordmarkenergy.de' },
    { name: 'Ravi Menon', company: 'Lumen Ledger', email: 'rmenon@lumenledger.com' },
    { name: 'Lucía Ferrer', company: 'Arden Mobility', email: 'lucia.ferrer@ardenmobility.com' },
  ],
};
