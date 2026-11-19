# Leadgidi presentation website

Marketing site for Leadgidi Enrich. Next.js 16 App Router, React 19, TypeScript strict, pnpm.
Built as a fully static export (`output: 'export'`) and deployed to GitHub Pages on push to `main` (`.github/workflows/deploy.yml`, custom domain via `public/CNAME`).
It also ships as a Docker image for Dokploy: `Dockerfile` builds the export (build argument `CATALOG_API_URL` is required, prices are baked in, so redeploy when the catalog changes; optional `APP_URL` becomes `NEXT_PUBLIC_APP_URL`, the app the CTAs link to, defaulting to production) and serves `out/` with unprivileged nginx on port 8080. `nginx.conf` keeps it SEO-safe: relative redirects (no container port behind the proxy), `/index.html` 301s to its trailing-slash URL, real 404 status with `404.html`, `image/png` for the extensionless `/opengraph-image`, gzip, immutable cache only for hashed `/_next/static/`.

## Commands

- `pnpm dev` - local dev server
- `pnpm build` - static export into `out/`; run it to verify any change (also type-checks)

There is no lint or test setup. Do not add one unless asked.

## Structure

- `src/app/` - routes plus metadata files (`layout.tsx`, `page.tsx`, `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `icon.svg`)
- `src/components/` - one component per file, kebab-case filenames, named exports, each with its own `*.module.css` when it has styles (client halves such as `ways-in-scroll.tsx` share their parent's module)
- `src/content/site.ts` - brand, URLs, SEO copy, navigation. CTAs go to the app's `/signup/`, Sign in to `/login/`; paid plan CTAs go to `/signup/?next=/dashboard/plans/checkout/?priceId=…&currency=usd` (built in `lib/pricing.ts` from the catalog `priceId`), and the app returns there after Keycloak so the user lands in Stripe checkout
- `src/content/home.ts` - all homepage section copy
- `src/content/pricing.ts` - billing labels, the published plans in order (Free, Starter, Business) with their taglines, the display currency, and `UPCOMING_FEATURE_CODES` (catalog entitlements not enforced in code yet, shown as "Coming soon"; remove a code once the feature ships); prices, credit tiers, discounts and currencies come from the backend's public billing catalog
- `src/lib/catalog.ts` - fetches `${CATALOG_API_URL}/feapi/billing/catalog` at build time; the build fails if the variable is missing or a price is absent, so never hardcode prices. Locally set `CATALOG_API_URL=http://localhost:8082` in `.env.local`; in CI it is the `CATALOG_API_URL` repository variable. Changing prices: run `cm.py` in `backend/stripe-catalog`, then rerun the deploy workflow (or send a `billing-catalog-updated` repository_dispatch)
- `src/content/showcase.ts` - example people for the hero enrichment showcase
- `src/content/docs/` - the `/docs/` guides as typed blocks (`paragraph`, `heading`, `list`, `code`, `table`, `note`; inline `` `code` `` and `[label](href)` only), grouped into sections in `index.ts` with the docs UI copy. Every claim follows the same product-claims rule as the homepage
- `src/lib/openapi.ts` - fetches `${CATALOG_API_URL}/openapi.yml` at build time (parsed with `yaml`) and turns each operation into an API reference page under `/docs/api/<operation-id>/`; the build fails if the document is missing, so the reference never drifts from the backend
- `src/hooks/` - shared client hooks (`use-in-view`, `use-timeline`, `use-media-query`)
- `src/lib/` - logic without React: formatting (`format.ts`, the only place with a locale), pricing offers (`pricing.ts`), and `catalog.ts`, which fetches the billing catalog at build time from `CATALOG_API_URL` (set in `.env.local` locally and as a repository variable in the Pages workflow; the build fails without it)
- `src/app/globals.css` - design tokens, base styles and shared primitives (`.container`, `.section`, `.split`/`.split-reverse`/`.split-wide` layouts, `.frame` hairline box with `.frame-head-centered` and `.rails` `.rails-up`/`.rails-down` connectors, `--hatch-pattern`, `.showcase-panel` large rounded grey panel, `.button` with `-primary`/`-secondary`/`-outline`/`-small` variants and `.button-row`)

## Product claims

Copy must match what the backend and enrichment worker actually do. Before adding a claim (data sources, accuracy, integrations, compliance), verify it in the sibling `backend/` and `contact-enricher/` repos. The app UI contains marketing claims not backed by code; do not copy them from there.

## Static export constraints

The build must stay fully static. Never use:
- server actions, route handlers with dynamic behavior, `cookies()`, `headers()`, middleware
- `next/image` without `unoptimized` (no image optimization server)
- runtime data fetching that requires a server

Metadata routes (`sitemap.ts`, `robots.ts`, `opengraph-image.tsx`) must stay statically renderable.

## Content

- All user-facing text, URLs and emails live in `src/content/site.ts`. Never hardcode copy in components.
- SEO metadata and the JSON-LD organization schema in `layout.tsx` read from `site`; keep them in sync when copy changes.

## SEO

The page's main job is to rank for B2B contact enrichment searches and share well. Every change must preserve or improve this.

- Metadata lives only in `layout.tsx` via the `metadata` export, built from `site`. Never add raw `<meta>` tags.
- `seoTitle` stays under ~60 characters and `seoDescription` at 120-160, both leading with the product name and primary keyword.
- Exactly one `<h1>` per page. Headings follow order (`h1` > `h2` > `h3`) without skipping levels.
- Primary keywords ("B2B contact enrichment", "verified work email") must appear in server-rendered visible text, not only in metadata or in client-animated content.
- Use semantic landmarks: `header`, `main`, `footer`, `nav`, `section` with headings.
- Every new page gets its own `title`, `description` and `alternates.canonical`, plus an entry in `sitemap.ts`.
- Keep `metadataBase`, canonical URLs and sitemap URLs on `site.url`; with `trailingSlash: true`, internal links end in `/`.
- JSON-LD in `layout.tsx` must match visible content and use valid schema.org types; validate with Google's Rich Results Test after changes.
- `opengraph-image.tsx` renders at 1200x630 from `site` and `hero` copy; update it when they change.
- Images: meaningful `alt`, explicit `width`/`height` to avoid layout shift.
- Core Web Vitals: no render-blocking scripts, fonts only via `next/font`, client JS kept minimal, no layout shift from animated content (animated rows stay in the layout and only change opacity).
- `robots.ts` allows everything; never add `noindex` to production pages.

## Docs

`/docs/` works like Linear or Stripe docs: a sticky sidebar (guide sections, then the generated API reference), one article column, an "On this page" list from the `h2` headings at 1240px and up, and previous/next links. Below 960px the sidebar collapses into a `<details>` disclosure, no JS. Pages render through `DocsShell` (`src/components/docs/`), which uses `SiteHeader hasHero={false}` and `SiteFooter hasScenery={false}`. Header and footer anchors use `/#section` so they work from any page. The app's Docs links open `/docs/` in a new tab; it has no in-app documentation route.

## Components

- Server components by default. Add `'use client'` only for browser APIs, state or effects (`app-showcase.tsx`, `hero-scroll.tsx`, `fog-bank.tsx`, `hero-mountain.tsx`, `header-shell.tsx`, `ways-in-scroll.tsx`, `record-playback.tsx`, `pricing-calculator.tsx`, `mobile-menu.tsx`).
- Keep client components small; put pure logic (drawing, math) in plain functions outside the component.
- Tunable numbers go in named `SCREAMING_SNAKE_CASE` constants at the top of the file.
- Every effect cleans up what it starts: intervals, timeouts, listeners, observers, animation frames.
- Respect `prefers-reduced-motion` for any animation.
- The hero shows one idea only: a name and company becoming a verified email, inside an app window.
- The app window (`app-showcase.tsx`) mirrors the real app's Interactive enrich page (`frontend/src/components/dashboard`): inset sidebar with the same navigation groups, breadcrumb header, draft row, Recent table with Enriching/Found badges. Its colors come from the `--app-*` tokens and its icons from `app-icon.tsx` (lucide paths copied as SVG, no icon package). Update it when the app's dashboard changes.
- The hero backdrop is an isolated mountain image (transparent sky) above a fog bank on a light sky gradient (`fog-backdrop.tsx`). The fog bank (`fog-bank.tsx`, `src/lib/fog.ts`) is a half-resolution canvas of rotated smoke-texture puffs in bands that drift, get blown apart left and right by pointer movement, then spring back slowly. `hero-mountain.tsx` places the summit just below the CTA (`data-summit-anchor`) by measuring layout, so the copy never sits on the rock.
- Looping animations run only while visible (`useInView`). The `h1` is never hidden by an entrance animation (LCP).
- The hero is a sticky scroll stage driven by Motion (`hero-scroll.tsx`, `useScroll` + `useSpring`): first the copy sinks behind the mountain layer (rendered between copy and window), then the app window rises and grows. Desktop only; disabled for reduced motion.
- The header is transparent only while the page is at the very top (`header-shell.tsx`, passive scroll listener) and solid with a hairline bottom border (no shadow) as soon as the user scrolls; its Start for free button stays hidden while the hero CTA is on screen (`data-hero-cta-visible`), so the rising app window never shows through the nav; the hero sits under the header via a negative top margin.
- Text motion is CSS only: the hero `h1` words sharpen in from a blur on load (never from opacity 0), then lede, CTA and window rise in. Only section titles (`.section-title`) are scrubbed by scroll via `animation-timeline: view()` inside `@supports`, so browsers without it show static text; ledes, items, FAQ rows and CTAs render static. Every looping animation (result marquee, hero app window, footer fog) has a `MotionPause` pause/play button, hidden under reduced motion. On touch devices the footer fog is light so the wordmark shows without a pointer, and below 960px each Developers step shows its preview inline.
- Section headings use `SectionHeading`: one `h2` with a dark title sentence and a muted continuation (no separate lede paragraph). The example record sits in a large rounded panel and plays once when scrolled into view (`record-playback.tsx`: request bubble, "Enriching" shimmer, then the card rises; the server-rendered state is the finished record). The pay-per-result section shows a CSS-only marquee of result cards (found = 1 credit, no match = refunded), paused for reduced motion and skipped off-screen with `content-visibility`.
- Below the hero, the first sections sit on a faint topographic contour backdrop (`.contour-backdrop`, `public/backdrop/contours.svg`, generated once as static smooth closed curves around a summit, masked so it shows only at the side edges, never behind content) so the mountain theme carries down the page.
- The Developers section (`ways-in.tsx`, `ways-in-scroll.tsx`) follows a bordered frame: centered heading band, sticky fixed-size device screen (light bezel) on a hatched left column showing a web results list, a spreadsheet whose work_email cells fill in, or a JSON entry response highlighted by `src/lib/json-tokens.ts`, steps (icon label, title, body) on the right whose active step marks the column divider. Steps are clickable buttons and also follow scroll.
- Pricing (`pricing.tsx`, `pricing-calculator.tsx`, `plan-column.tsx`) is a Navattic-style bordered frame: centered heading band with the billing toggle and credit slider, then Free / Starter / Business columns split by hairlines. Every column lists the same rows (credits, buying more credits, then the union of catalog features) so plans compare side by side: included rows get a green check, missing rows are muted with a dash, upcoming ones carry a Coming soon tag. Rows come only from the catalog, never invented.
- FAQ and the closing CTA sit in the same bordered frame style as Developers (hatched panels, hairline borders); the FAQ frame's side lines fade in from above and the CTA frame's side lines run up to meet the FAQ frame and fade out downward into the footer, so the two read as one structure.
- The page ends with a centered closing CTA and a footer (link columns from `site.footerColumns`) that closes on a static landscape: the hero mountain image with a dense variant of the hero fog bank (`FogBank density="dense"`, only animating while in view) that hides a solid `Leadgidi` wordmark until the pointer blows the clouds apart and drifting CSS fog at its base. It is decorative (`aria-hidden`).
- Decorative elements get `aria-hidden="true"`.
- Import via the `@/` alias, not relative `../` paths.

## Styling

- CSS Modules per component plus tokens in `globals.css`. No Tailwind, CSS-in-JS or inline styles.
- Inter (`layout.tsx`, via `next/font`) matches the app dashboard and the Stripe checkout font, so the site, app and checkout read as one product.
- Colors and spacing come from CSS custom properties on `:root`. The site is light-only by design; do not add a dark theme.
- Class names are kebab-case; state modifiers use the `is-` prefix (`is-fading`).
- Mobile-first; check layout at phone width with no horizontal scroll.
- Keep visible focus styles (`:focus-visible`) on every interactive element.

## Dependencies

Keep the dependency list minimal. Prefer platform APIs over new packages; ask before adding any.

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read these installed skill files directly (use these paths even if a same-named global skill exists):
- Core filter, always on: `antislop`: `.claude/skills/antislop/SKILL.md`
- UI / visual: `antislop-ui`: `.claude/skills/antislop-ui/SKILL.md`
- Copy & text: `antislop-copywriting`: `.claude/skills/antislop-copywriting/SKILL.md`
- People: `antislop-human`: `.claude/skills/antislop-human/SKILL.md`
- Mobile / responsive: `antislop-layoutmobile`: `.claude/skills/antislop-layoutmobile/SKILL.md`
- Code comments: `antislop-code`: `.claude/skills/antislop-code/SKILL.md`
Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits, using the actual mode and source. Acknowledging the user's request without naming the source does not replace this notice.
Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.
If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept. For read-only tasks, put the active-mode notice only at the start of the final answer, never in progress messages. For editing tasks, announce before the first edit and omit it from the final answer.
To update antislop later: `npx antislop-ai --update`, or run `npx antislop-ai` and pick Overwrite them.
<!-- antislop:end -->
