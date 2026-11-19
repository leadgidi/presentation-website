import type { DocPage } from './types';

export const interactiveEnrich: DocPage = {
  slug: 'interactive-enrich',
  title: 'Look up a few people',
  description: 'Enrich up to 25 people by typing them in, without preparing a file.',
  blocks: [
    {
      type: 'paragraph',
      text: 'Interactive enrich is the quickest way to check a handful of people. Open Interactive enrich in the app and fill in one row per person.',
    },
    {
      type: 'list',
      isOrdered: true,
      items: [
        'Type the first name, last name and company. Add the company website if you know it; it helps find the right company.',
        'Add more rows as needed, up to 25 people per run.',
        'Select Enrich. Each row shows its status while the lookup runs, then the email, phone and title we found.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Every run also appears in History, so you can come back to the results later. For longer lists, [import a file](/docs/import-a-file/).',
    },
  ],
};

export const importAFile: DocPage = {
  slug: 'import-a-file',
  title: 'Import a file',
  description: 'Supported formats, the CSV columns, and what the result file looks like.',
  blocks: [
    {
      type: 'paragraph',
      text: 'Open Enrich a file in the app and drop in a CSV, NDJSON, JSONL or ZIP file up to 512 MB. The file is checked first, then processing starts on its own. You can follow it under In progress and download the result when it finishes.',
    },
    { type: 'heading', text: 'Supported files' },
    {
      type: 'table',
      columns: ['Extension', 'Content'],
      rows: [
        ['`.csv`', 'A header row, then one person per row.'],
        ['`.ndjson`, `.jsonl`', 'One JSON object per line, one person per object.'],
        ['`.zip`', 'Up to 100 CSV, NDJSON or JSONL files. No nested archives or password protection.'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Files must be UTF-8 and use a lowercase extension. Each file needs at least one person.',
    },
    { type: 'heading', text: 'CSV columns' },
    {
      type: 'paragraph',
      text: 'Column names are exact and case-sensitive. Use these names, not shortcuts like `company` or `website`.',
    },
    {
      type: 'table',
      columns: ['Column', 'Required', 'Meaning'],
      rows: [
        ['`name`', 'Yes', 'Full name of the person'],
        ['`jobs.0.company.name`', 'Yes', 'Company name'],
        ['`jobs.0.company.website`', 'No', 'Company website, starting with `http://` or `https://`'],
        ['`jobs.0.company.linkedinUrl`', 'No', 'Company LinkedIn URL'],
        ['`linkedinUrl`', 'No', 'The person’s LinkedIn URL'],
        ['`metadata.KEY`', 'No', 'Any value you want back on the result, such as `metadata.crmId`'],
      ],
    },
    {
      type: 'code',
      language: 'csv',
      code: 'name,jobs.0.company.name,jobs.0.company.website,metadata.crmId\nJane Doe,Acme,https://acme.example,lead-1042',
    },
    {
      type: 'paragraph',
      text: 'For a second company, add the same columns with `jobs.1.`, up to `jobs.4.`. Leave optional cells empty when you do not know the value. Unknown columns make the whole file fail, so remove them before uploading.',
    },
    { type: 'heading', text: 'NDJSON and JSONL' },
    {
      type: 'paragraph',
      text: 'Put one person object on each line, in the same shape as the API. Do not wrap the lines in an array.',
    },
    {
      type: 'code',
      language: 'json',
      code: '{"name":"Jane Doe","jobs":[{"company":{"name":"Acme","website":"https://acme.example"}}],"metadata":{"crmId":"lead-1042"}}',
    },
    { type: 'heading', text: 'Invalid rows' },
    {
      type: 'paragraph',
      text: 'A row with a missing name or company does not stop the file. It becomes a `FAILED` entry with the code `INVALID_INPUT`, costs nothing, and the rest of the file carries on. The whole file fails only when it cannot be read, for example invalid UTF-8, a missing header or an unknown column.',
    },
    { type: 'heading', text: 'The result file' },
    {
      type: 'list',
      items: [
        'It keeps the format you uploaded: CSV comes back as CSV, NDJSON and JSONL as NDJSON, ZIP as ZIP.',
        'Its name ends in `.results`, so `contacts.csv` becomes `contacts.results.csv`.',
        'Every row you sent is in it, including failed rows, in the original order.',
        'If you cancel, you can still download a partial file with the rows that finished.',
      ],
    },
  ],
};

export const history: DocPage = {
  slug: 'history',
  title: 'History',
  description: 'Find people you looked up before, and download past result files.',
  blocks: [
    {
      type: 'paragraph',
      text: 'History lists the people you looked up with Interactive enrich, newest first. Open a row to see the full record and copy the email or phone number.',
    },
    {
      type: 'paragraph',
      text: 'Imported files are listed under Enrich a file instead, where you can download each result file again. Enrichments sent through the API are read back through the API.',
    },
  ],
};
