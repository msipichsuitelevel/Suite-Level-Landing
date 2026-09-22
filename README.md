# Suite Level Landing

The public marketing site for Suite Level. Next.js, exported to plain static
files and served by IIS. There is no Node process in production.

## Quick start

```bash
bun install
cp .env.example .env.local     # then fill in the values
bun run dev                    # prints the URL it bound to
```

Both commands print the URL they bound to. Next tries 3000 and moves to the
next free port if something else holds it, saying so and naming the process:

    ⚠ Port 3000 is in use by process 92978, using available port 3001 instead.
    - Local:  http://localhost:3001

Read that line rather than assuming 3000. Other things on a dev machine sit on
3000, and `bun run start` serves a **production** build, where react-grab and
anything else behind a NODE_ENV check is stripped out. If
`window.__REACT_GRAB__` is undefined, check which of the two you are looking at
before anything else: on a production build it always will be, and editing the
source will appear to do nothing because nothing rebuilds.

## Build and deploy

```bash
bun run build                  # writes ./out
```

Deploy the **contents of `out/`** as the IIS site's physical directory.
`public/web.config` is copied into `out/` by the build and configures IIS:
default documents, MIME types, the 404 page and cache headers. It uses only
core IIS features, so the URL Rewrite module is **not** required.

Two things about the export worth knowing before changing anything:

- `trailingSlash: true` makes every route a folder with an `index.html`, which
  is how IIS resolves `/privacy-policy/` without rewrite rules.
- `images: { unoptimized: true }` is mandatory. `next/image`'s optimizer needs a
  server, and there isn't one.

Every `NEXT_PUBLIC_*` value is **baked in at build time**. Changing one means
rebuilding and redeploying; editing a file in `out/` will not do it.

## Configuration

See `.env.example` for the full list. `.env.local` is git-ignored and must stay
that way: **this repository is public.**

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_API_URL` | Suite Level API origin, no trailing slash |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for this site; drives canonical URLs, the sitemap and OG tags |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA **site** key. Public by design |
| `NEXT_PUBLIC_RECAPTCHA_VERSION` | `v2-invisible` (what Suite Level uses), `v2-checkbox` or `v3` |

### About the reCAPTCHA keys

The **site key** is public. It is inlined into the JavaScript and visible to
anyone who views the page; that is how reCAPTCHA works and it proves nothing on
its own.

The **secret key** never appears in this repository. It lives in the API's app
settings as `ReCaptcha:SecretKey` (or the `ReCaptcha__SecretKey` environment
variable). The API verifies every token against Google before it records a
request or sends mail, and it **fails closed** if the secret is missing.

Suite Level's key is **reCAPTCHA v2 invisible**. There is no tick box: the
challenge runs when the form is submitted, and most visitors never see anything.
`NEXT_PUBLIC_RECAPTCHA_VERSION` has to match the product the key was registered
for; the wrong value fails with "Invalid site key" in the browser console.

The floating reCAPTCHA badge is hidden in `globals.css`. Google allows that only
if the page shows the reCAPTCHA attribution instead, which `AccessForm` renders
under the form. If you remove that line, un-hide the badge. Also make sure every domain the site
is served from is listed in the reCAPTCHA admin console, including `localhost`
for local work, or the widget will refuse to appear.

## How the waitlist works

1. A visitor enters their full name and email and passes reCAPTCHA.
2. `POST {API}/api/AccessRequest/Submit` verifies the token and records the
   request. The address is unique: joining twice returns "already on the
   waitlist" rather than a second entry.
3. Nothing is emailed to the visitor. The team is notified and decides who to
   let in. This site does not link to the application at all.

The endpoint returns `OperationResult`, so a **rejected** request still comes
back as HTTP 200 with `isSuccess: false`. `src/components/AccessForm.tsx`
checks both; checking `response.ok` alone would report a rejection as a success.

## Assets

- `public/shots/` are real product screenshots showing mock data.
- `public/suite-level-square.svg` and `favicon.svg` are the application's own
  brand marks, copied from the Suite Level client. They are the source for every
  icon and the social card.
- `bun run icons` regenerates `favicon.ico`, `apple-touch-icon.png`,
  `icon-192.png`, `icon-512.png` and `og-image.png` from those marks. The
  outputs are committed, so a deploy never depends on the script running.

## SEO

Metadata, Open Graph and Twitter cards come from `src/app/layout.tsx`.
`sitemap.xml` and `robots.txt` are generated at build time from
`src/app/sitemap.ts` and `src/app/robots.ts`, both of which read
`NEXT_PUBLIC_SITE_URL` — so setting that correctly at build time matters.

JSON-LD is emitted in two places: Organization and WebSite in the layout,
SoftwareApplication and FAQPage on the home page. The FAQ markup is built from
the same `src/lib/content.ts` the page renders, so the two cannot drift; Google
drops FAQ markup that does not match the visible page.

## Privacy Policy

`src/app/privacy-policy/page.tsx` is a **mirror**. The Suite Level application
is the source of truth: users accept a *version* of the policy at signup and the
API rejects any other version. A material change has to land in the app first,
bump `PRIVACY_POLICY_VERSION` and `PRIVACY_POLICY_LAST_UPDATED` there, and then
be copied here with the `VERSION` constant updated to match.

There is no Terms of Service page or link here. The application serves its own
terms; this site does not point at them.
