# ADR 0016 — Build-time PDF + OG images via Playwright on system Chrome

**Status:** Accepted
**Date:** 2026-10-09

## Context

Plan requires `/resume.pdf` from the same data as the web page, and
auto-generated OG images per post/project.

## Decision

`scripts/postbuild.mjs` (runs after `astro build`):

1. Serves `dist/` on a local port.
2. Screenshots hidden `/og/<slug>/` card pages (manifest:
   `/og-manifest.json`) to PNG with Playwright.
3. Prints `/resume/` (print stylesheet applied) to `/resume.pdf`.
4. Indexes with Pagefind (see ADR 0006).

Browsers launch via `channel: 'chrome'` — the system Chrome — avoiding
Playwright browser downloads locally and in CI (GitHub runners ship Chrome).

## Consequences

- One mechanism, zero extra deps beyond already-used Playwright.
- If Chrome is missing the build fails loudly (PDF is a deliverable, not optional).
