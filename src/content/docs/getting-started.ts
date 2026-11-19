import type { DocPage } from './types';

export const howItWorks: DocPage = {
  slug: 'how-it-works',
  title: 'How enrichment works',
  description: 'What you send, what comes back, and the states an enrichment moves through.',
  blocks: [
    {
      type: 'paragraph',
      text: 'An enrichment is one list of people you want contact details for. You send each person with a name and at least one company, and Leadgidi looks for their work email, phone numbers and job title.',
    },
    { type: 'heading', text: 'What you send' },
    {
      type: 'list',
      items: [
        'A full name. Required.',
        'Up to 5 jobs, each with a company name. At least one is required.',
        'Optional: the company website, the company LinkedIn URL and the person’s LinkedIn URL. They help find the right person.',
        'Optional: up to 20 metadata values, such as a CRM ID. They come back unchanged on the result and are not used for matching.',
      ],
    },
    { type: 'heading', text: 'What comes back' },
    {
      type: 'paragraph',
      text: 'Each person you send becomes one entry. A found entry can include:',
    },
    {
      type: 'list',
      items: [
        'A work email address, marked `isCatchAll` when the domain accepts any address and `isRole` when it is a shared inbox such as sales@.',
        'Up to 5 work phone numbers in E.164 format, such as `+14155550100`.',
        'The job title, and company details such as website, country and an estimated employee count.',
      ],
    },
    {
      type: 'note',
      text: 'Fields we could not find are left out of the result instead of being sent empty.',
    },
    { type: 'heading', text: 'Entry outcomes' },
    {
      type: 'table',
      columns: ['Outcome', 'Meaning', 'Credit'],
      rows: [
        ['`FOUND`', 'At least one work email or phone number was found.', '1 credit'],
        ['`NOT_FOUND`', 'The lookup finished without work contact details.', 'Refunded'],
        ['`FAILED`', 'The record was invalid or could not be processed.', 'Refunded'],
        ['`CANCELED`', 'The enrichment was canceled before this entry finished.', 'Refunded'],
      ],
    },
    { type: 'heading', text: 'Enrichment states' },
    {
      type: 'paragraph',
      text: 'Every enrichment runs in the background, whether it started in the app, from a file or through the API. It moves through these states:',
    },
    {
      type: 'table',
      columns: ['State', 'Meaning'],
      rows: [
        ['`AWAITING_UPLOAD`', 'Waiting for the file. File enrichments only.'],
        ['`VALIDATING`', 'Checking the file and counting its records. File enrichments only.'],
        ['`QUEUED`', 'Accepted and waiting for a worker.'],
        ['`PROCESSING`', 'Looking up people. Entries finish one by one.'],
        ['`FINALIZING`', 'Every entry is done and the result file is being written.'],
        ['`COMPLETED`', 'Finished. The result file covers every entry, including failed ones.'],
        ['`CANCELING`', 'Cancellation was requested. Lookups already running can still finish.'],
        ['`CANCELED`', 'Stopped. Entries that finished keep their results.'],
        ['`FAILED`', 'The whole enrichment stopped, for example because the file was invalid. No result file is written.'],
      ],
    },
    {
      type: 'paragraph',
      text: '`COMPLETED`, `CANCELED` and `FAILED` are final. A completed enrichment can still contain failed entries; check its progress counts or the entry list.',
    },
  ],
};

export const credits: DocPage = {
  slug: 'credits',
  title: 'Credits',
  description: 'When a credit is reserved, when it is used and when it comes back.',
  blocks: [
    {
      type: 'paragraph',
      text: 'One credit pays for one person we find. You only pay for `FOUND` entries.',
    },
    { type: 'heading', text: 'How a run is charged' },
    {
      type: 'list',
      isOrdered: true,
      items: [
        'When an enrichment starts, we reserve one credit for every person in it. Your balance needs to cover the whole list.',
        'Each person we find uses their reserved credit.',
        'When the enrichment ends, the credits for people we did not find, and for failed or canceled entries, return to your balance.',
      ],
    },
    { type: 'heading', text: 'When your balance is too low' },
    {
      type: 'list',
      items: [
        'An API request returns `402` with the problem type `insufficient-credits`, and no enrichment is created.',
        'A file enrichment ends in `FAILED` with the code `INSUFFICIENT_CREDITS` after the upload is checked.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Top up from Buy credits in the app, or pick a plan on the [pricing page](/#pricing).',
    },
    { type: 'heading', text: 'Expiry' },
    {
      type: 'paragraph',
      text: 'Credits stay valid for at least a year after you buy them. On a subscription they stay valid while it renews, plus 7 days after it ends. Every purchase extends all the credits you already have.',
    },
  ],
};
