# Leadgidi presentation website

One-page coming-soon site built with Next.js: wordmark, headline, a canvas dot field that
lights up in waves and around the pointer, and a waitlist form. No UI or animation libraries.

## Develop

```
pnpm install
pnpm dev
```

All copy lives in `src/content/site.ts`.

## Waitlist

The form posts `{ "email": "...", "source": "website" }` as JSON to the URL in
`WAITLIST_WEBHOOK_URL` (see `.env.example`). Until the variable is set, the form tells
visitors to write to the contact email instead.

### Collecting emails in a Google Sheet

1. Create a Google Sheet. In row 1 put the headers `date`, `email`, `source`.
2. Open Extensions, then Apps Script, and replace the editor content with:

```js
function doPost(request) {
  const body = JSON.parse(request.postData.contents);
  const secret = PropertiesService.getScriptProperties().getProperty('WAITLIST_SECRET');
  if (!secret || body.token !== secret) return ContentService.createTextOutput('forbidden');
  SpreadsheetApp.getActiveSpreadsheet()
    .getSheets()[0]
    .appendRow([new Date(), body.email, body.source]);
  return ContentService.createTextOutput('ok');
}
```

3. In Project Settings, under Script Properties, add `WAITLIST_SECRET` with a long
   random value (for example the output of `openssl rand -hex 32`).
4. Click Deploy, then New deployment. Type: Web app. Execute as: Me.
   Who has access: Anyone. Click Deploy and authorize the script.
5. Copy the web app URL (it ends in `/exec`) into `WAITLIST_WEBHOOK_URL` and the same
   random value into `WAITLIST_SECRET`, locally in `.env.local` and on Hostinger in the
   app's environment variables.

Test it from a terminal:

```
curl -L -X POST "$WAITLIST_WEBHOOK_URL" -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"source\":\"curl\",\"token\":\"$WAITLIST_SECRET\"}"
```

### Abuse protection

- A hidden honeypot field: bots that fill it get a fake success and nothing is sent.
- At most 5 attempts per IP per hour, counted in memory on the server.
- The webhook call carries `WAITLIST_SECRET`, so only the site can append rows.
- Email is validated on the server (format and length) before anything is sent.

A new row should appear in the sheet.

## Deploy on Hostinger

Connect this GitHub repository in hPanel as a Node.js web app. Hostinger detects
Next.js and pnpm from the lockfile and runs:

```
pnpm install
pnpm build
pnpm start
```

Set `WAITLIST_WEBHOOK_URL` in the app's environment variables in hPanel.
Every push to the deployed branch triggers a new build.
