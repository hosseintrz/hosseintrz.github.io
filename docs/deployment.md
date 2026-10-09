# Deployment

The site deploys to **GitHub Pages at `https://hosseintrz.github.io`** via
GitHub Actions (`.github/workflows/deploy.yml`). Every push to `main` builds
the site (including OG images, `/resume.pdf`, and the Pagefind search index)
and deploys it with the official `actions/deploy-pages` action.

## One-time setup (already done if the first deploy went green)

1. Repo exists as `hosseintrz/hosseintrz.github.io` (user Pages).
2. Pages must use **GitHub Actions** as its source:
   - Repo → Settings → Pages → Build and deployment → Source: **GitHub Actions**.
   - Or via API (needs a token with `repo` scope):
     ```sh
     curl -X POST https://api.github.com/repos/hosseintrz/hosseintrz.github.io/pages \
       -H "Authorization: Bearer <token>" \
       -d '{"build_type":"workflow"}'
     ```
   If the first deploy fails with "Pages site is not configured", this is the fix.
3. Visibility: Pages deploys work on free plans for **public** repos. If you
   make the repo private, Pages requires GitHub Pro.

## Rollback

Deploys are just commits. Revert the offending commit and push:

```sh
git revert <commit> && git push
```

The next run of `deploy.yml` redeploys the older content. There is no separate
artifact retention to manage.

## Custom domain

1. Buy the domain; add a DNS `A`/`CNAME` record:
   - Apex: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Or `www` → `hosseintrz.github.io` (CNAME)
2. Repo → Settings → Pages → Custom domain → enter it, wait for DNS check,
   enable **Enforce HTTPS** after the certificate is issued.
3. Add a file `public/CNAME` containing the domain so it survives deploys.
4. Update `site` in `astro.config.mjs` and `url` in `src/config/site.ts` to
   the new domain (affects sitemap, canonical URLs, OG image URLs, RSS).

## Pipeline details

- `deploy.yml`: build job (pnpm cached, Node from `.nvmrc`) → `upload-pages-artifact`
  → `deploy-pages`. Concurrency group `pages` prevents overlapping deploys.
- CI (`.github/workflows/ci.yml`) runs the same build plus lint, typecheck,
  unit + e2e tests, contrast check, link check, and Lighthouse thresholds on
  every PR.
- If a build fails, the previous deployment stays live (artifact deploys are atomic).

## Local verification before pushing

```sh
pnpm check       # lint + typecheck + build + unit tests + contrast
pnpm test:e2e    # Playwright against the built site
```

`pnpm build` runs the full postbuild pipeline (OG screenshots via the system
Chrome, resume PDF, Pagefind index) — the same steps CI and deploy run.