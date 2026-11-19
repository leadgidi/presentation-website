import type { DocPage } from './types';

const API_BASE_URL = 'https://api.leadgidi.com';

export const quickstart: DocPage = {
  slug: 'api-quickstart',
  title: 'API quickstart',
  description: 'Send your first people to the API and read the results.',
  blocks: [
    {
      type: 'paragraph',
      text: `The API is a REST API at \`${API_BASE_URL}\`. It takes JSON, returns JSON, and every enrichment runs in the background: you submit people, then read the results when they are ready.`,
    },
    { type: 'heading', text: '1. Create an API key' },
    {
      type: 'paragraph',
      text: 'In the app, open API keys, select Create key and copy it. The key is shown only once. Store it as an environment variable:',
    },
    { type: 'code', language: 'bash', code: 'export LEADGIDI_API_KEY="paste-your-key-here"' },
    { type: 'heading', text: '2. Submit people' },
    {
      type: 'paragraph',
      text: 'Send up to 2,500 people per request. The `Idempotency-Key` header is required; any unique string works, such as a UUID.',
    },
    {
      type: 'code',
      language: 'bash',
      code: `curl ${API_BASE_URL}/enrichments \\
  -H "Authorization: Bearer $LEADGIDI_API_KEY" \\
  -H "Idempotency-Key: $(uuidgen)" \\
  -H "Content-Type: application/json" \\
  -d '{
    "people": [
      {
        "name": "Jane Doe",
        "jobs": [{ "company": { "name": "Acme", "website": "https://acme.example" } }]
      }
    ]
  }'`,
    },
    {
      type: 'paragraph',
      text: 'The response is `201` with the new enrichment and your remaining balance. Keep `enrichment.id`.',
    },
    {
      type: 'code',
      language: 'json',
      code: `{
  "enrichment": {
    "id": "018d05b8-538e-7360-8430-10332857463f",
    "state": { "status": "QUEUED" },
    "progress": { "totalEntries": 1, "finishedEntries": 0, "foundEntries": 0 }
  },
  "availableCredits": 99
}`,
    },
    { type: 'heading', text: '3. Wait for it to finish' },
    {
      type: 'paragraph',
      text: 'Read the enrichment until `state.status` is `COMPLETED`, `CANCELED` or `FAILED`. While it is still running, each response carries a `Retry-After` header with the number of seconds to wait before the next read.',
    },
    {
      type: 'code',
      language: 'bash',
      code: `curl ${API_BASE_URL}/enrichments/ENRICHMENT_ID \\
  -H "Authorization: Bearer $LEADGIDI_API_KEY"`,
    },
    { type: 'heading', text: '4. Read the results' },
    {
      type: 'paragraph',
      text: 'List the entries, in the order you sent them, 250 per page by default and up to 500 with `pageSize`. You can read them while the enrichment is still running; finished entries already have their outcome.',
    },
    {
      type: 'code',
      language: 'bash',
      code: `curl "${API_BASE_URL}/enrichments/ENRICHMENT_ID/entries?page=1&pageSize=500" \\
  -H "Authorization: Bearer $LEADGIDI_API_KEY"`,
    },
    {
      type: 'paragraph',
      text: 'Or download everything as one NDJSON file from [the result file endpoint](/docs/api/download-enrichment-result-file/) once `resultFile.status` is `AVAILABLE`.',
    },
  ],
};

export const authentication: DocPage = {
  slug: 'authentication',
  title: 'Authentication',
  description: 'API keys, the Authorization header, and keeping keys safe.',
  blocks: [
    {
      type: 'paragraph',
      text: 'Every request needs an API key in the `Authorization` header as a bearer token:',
    },
    { type: 'code', language: 'http', code: 'Authorization: Bearer YOUR_API_KEY' },
    {
      type: 'list',
      items: [
        'Create and revoke keys under API keys in the app. A key is shown once, when you create it.',
        'A key acts as the user who created it. Enrichments, results and credits belong to that account.',
        'A missing, revoked or wrong key returns `401`.',
        'Never send the key to a file upload URL. Those URLs carry their own signature.',
      ],
    },
    {
      type: 'note',
      text: 'Keep keys on your server. Anyone with a key can spend your credits, so never put one in browser code or a public repository. Revoke a key as soon as you think it leaked.',
    },
  ],
};

export const fileUploads: DocPage = {
  slug: 'api-file-uploads',
  title: 'Upload a file through the API',
  description: 'Enrich more than 2,500 people at once by uploading a file.',
  blocks: [
    {
      type: 'paragraph',
      text: 'For lists over 2,500 people, upload a file instead of sending JSON. The file follows the same rules as [importing a file in the app](/docs/import-a-file/), up to 512 MB.',
    },
    { type: 'heading', text: '1. Reserve the upload' },
    {
      type: 'paragraph',
      text: 'Send the file name and its exact size in bytes. The extension decides the format.',
    },
    {
      type: 'code',
      language: 'bash',
      code: `curl ${API_BASE_URL}/enrichments/file-uploads \\
  -H "Authorization: Bearer $LEADGIDI_API_KEY" \\
  -H "Idempotency-Key: $(uuidgen)" \\
  -H "Content-Type: application/json" \\
  -d '{ "filename": "contacts.csv", "sizeBytes": 1048576 }'`,
    },
    {
      type: 'paragraph',
      text: 'The response holds the enrichment, in `AWAITING_UPLOAD`, and an `upload` object with a method, URL, headers and an expiry time.',
    },
    { type: 'heading', text: '2. Upload the bytes' },
    {
      type: 'paragraph',
      text: 'Send the file to `upload.url` with `upload.method` and exactly the headers in `upload.headers`. Use the URL as it is, query string included, and do not add your API key.',
    },
    {
      type: 'code',
      language: 'bash',
      code: `curl -X PUT "UPLOAD_URL" \\
  -H "Content-Type: text/csv" \\
  --data-binary @contacts.csv`,
    },
    {
      type: 'paragraph',
      text: 'There is no confirmation call. Once the upload arrives, the file is checked and processing starts.',
    },
    { type: 'heading', text: '3. Follow it and download' },
    {
      type: 'paragraph',
      text: 'Read the enrichment as in the [quickstart](/docs/api-quickstart/). If the upload URL expires first, the enrichment fails with `UPLOAD_EXPIRED`; reserve a new upload. When it completes, the result file has the same format as your upload.',
    },
  ],
};

export const retries: DocPage = {
  slug: 'idempotency-and-retries',
  title: 'Idempotency and retries',
  description: 'Retry requests safely without creating or paying for an enrichment twice.',
  blocks: [
    {
      type: 'paragraph',
      text: 'Both create endpoints require an `Idempotency-Key` header. Generate a new key for each new submission, and reuse it only when you retry that same submission.',
    },
    {
      type: 'table',
      columns: ['You send', 'You get'],
      rows: [
        ['A new key', 'A new enrichment, `201`.'],
        ['The same key and the same body', 'The existing enrichment, `200`. No new work, no new charge.'],
        ['The same key and a different body', '`409` with `idempotency-key-reused`. Use a new key.'],
        ['The same key while the first request is still saving', '`409` with `idempotency-in-progress`. Wait for `Retry-After`, then retry.'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Keys are kept for at least 24 hours. Up to 255 characters; a UUID is a good choice.',
    },
    { type: 'heading', text: 'When to retry' },
    {
      type: 'list',
      items: [
        'Network errors, timeouts and `500`: retry with the same key.',
        '`429`: wait the number of seconds in `Retry-After`, then retry.',
        '`400`, `401`, `402` and `404`: fix the request first; retrying it unchanged gives the same answer.',
      ],
    },
    { type: 'heading', text: 'Polling' },
    {
      type: 'paragraph',
      text: 'While an enrichment is running, reads of it return `Retry-After`. Wait that long between reads. Finished enrichments do not send it.',
    },
  ],
};

export const errors: DocPage = {
  slug: 'errors',
  title: 'Errors',
  description: 'Status codes and the problem types the API returns.',
  blocks: [
    {
      type: 'paragraph',
      text: 'Errors use HTTP status codes and a JSON body in the `application/problem+json` format. Branch on `type`, which never changes; `detail` is written for people and can change.',
    },
    {
      type: 'code',
      language: 'json',
      code: `{
  "type": "urn:leadgidi:problem:insufficient-credits",
  "title": "Payment Required",
  "status": 402,
  "detail": "Insufficient available credits. No enrichment is created for a JSON submission."
}`,
    },
    {
      type: 'table',
      columns: ['Status', 'Problem type', 'What to do'],
      rows: [
        ['400', '`invalid-request`', 'Check the body and parameters against the API reference.'],
        ['401', '`unauthorized`', 'Check the API key and the `Authorization` header.'],
        ['402', '`insufficient-credits`', 'Buy credits, or send fewer people.'],
        ['404', '`not-found`', 'The enrichment does not exist or belongs to another account.'],
        ['409', '`idempotency-key-reused`', 'Use a new idempotency key for a new submission.'],
        ['409', '`idempotency-in-progress`', 'Retry the same request after `Retry-After`.'],
        ['409', '`cancellation-not-allowed`', 'The enrichment is finishing or finished; read its state.'],
        ['409', '`result-file-unavailable`', 'Wait until `resultFile.status` is `AVAILABLE`.'],
        ['413', '`payload-too-large`', 'Send fewer people per request, or upload a file.'],
        ['429', '`rate-limited`', 'Wait `Retry-After` seconds.'],
        ['500', '`internal-error`', 'Retry with the same idempotency key.'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Every problem type starts with `urn:leadgidi:problem:`. Problems inside one enrichment, such as an invalid row, are not HTTP errors: they appear on the entry as `outcome.failure`.',
    },
  ],
};
