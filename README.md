# Leadgidi presentation website

One-page coming-soon site built with Next.js and exported as static HTML: wordmark,
headline, rotating tagline and a canvas dot field that reacts to the pointer.
No UI or animation libraries.

## Develop

```
pnpm install
pnpm dev
```

All copy lives in `src/content/site.ts`. `pnpm build` writes the static site to `out/`.

## Deploy on GitHub Pages

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and
publishes `out/` to GitHub Pages.

One-time setup in the repository on GitHub:

1. Settings, Pages, Build and deployment, Source: GitHub Actions.
2. Settings, Pages, Custom domain: `leadgidi.com`, then tick Enforce HTTPS once
   the DNS check passes. The domain is also in `public/CNAME`.

DNS at the registrar:

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | `<github-user>.github.io` |
