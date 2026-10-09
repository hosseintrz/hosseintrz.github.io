# ADR 0009 — Hosting: GitHub Pages via GitHub Actions

**Status:** Accepted
**Date:** 2026-10-09

## Context

Free static hosting for a personal site; plan requires `actions/deploy-pages`.

## Decision

`.github/workflows/deploy.yml`: build (with postbuild pipeline) →
`upload-pages-artifact` → `deploy-pages` on every push to `main`.
CI (`.github/workflows/ci.yml`) gates PRs with the same build + tests.

## Consequences

- Pages source must be set to "GitHub Actions" (docs/deployment.md).
- Build pipeline needs Chrome — GitHub runners ship with it; we launch via
  `channel: 'chrome'` (see ADR 0017).
