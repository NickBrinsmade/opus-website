# opus-website

The Opus marketing site, guides, and the request-access waitlist. Built with
[Astro](https://astro.build); GitHub Actions builds `main` and deploys it to
GitHub Pages (`.github/workflows/deploy.yml`). A push to `main` deploys.

This repo is **public**. Never put a secret or service-role key here. The
Supabase publishable key in `src/lib/site.ts` is public by design: row-level
security decides what it can do.

## Pages

- `/`: homepage. `/access/`: request access. `/privacy/`. `/guides/` and `/guides/<slug>/`.
- `/merge-artists/`: the artist-merge tool (plain HTML in `public/merge-artists/`).
  Submitting only records a row in `artist_merge_requests`; `datasets/apply_artist_merges.py`
  in opus-backend applies it.

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321, shows drafts too
npm run build      # production build + internal-link audit
```

## Guides

- Published guides: `src/content/guides/<slug>.mdx`. Frontmatter schema in `src/content.config.ts`.
- Drafts live **outside this repo** in `../guide-drafts/` and render only in `npm run dev`
  (with an orange DRAFT bar). Approving a draft = moving the file into `src/content/guides/`.
- CTAs: `<InlineCta heading="…" body="…" />` right after the quick answer and where the
  article describes the problem Opus solves. The end CTA, sticky mobile bar, FAQ and related
  guides are added by the template.
- Never describe how Opus works inside (models, matching, cropping, accuracy tests).
  General explanations of how art recognition works are fine.
- `npm run links` reports guides with no in-body links pointing at them, and other guides
  that mention a guide's target keyword without linking to it.

## Waitlist

Forms post to the `request_access` RPC (`datasets/access_requests.sql` in opus-backend).
Review and invite with `datasets/review_access_requests.py`.

## Analytics

Set `POSTHOG_KEY` in `src/lib/site.ts` to send page views, reading depth (25/50/75/90/100%),
sections reached, CTA views/clicks and sign-ups to PostHog. Without a key the events only
collect in `window.__opus.events`.

## Custom domain (opus-mobile.com)

1. Cloudflare DNS: four `A` records on `@` → 185.199.108.153, 185.199.109.153,
   185.199.110.153, 185.199.111.153 (DNS only, grey cloud), and `CNAME www` → `nickbrinsmade.github.io`.
2. Repo Settings → Pages → Custom domain: `opus-mobile.com`, then Enforce HTTPS.
3. Repo Settings → Variables: `SITE_URL=https://opus-mobile.com`, `SITE_BASE=/`. Re-run the deploy.
