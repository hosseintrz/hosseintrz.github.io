# ADR 0015 — Sample content ships as `draft: true`, except clearly-labeled SAMPLE entries

**Status:** Accepted
**Date:** 2026-10-09

## Context

The plan seeds every collection with 2–3 SAMPLE entries and forbids shipping
non-working placeholders. A freshly deployed personal site with only empty
states also looks broken to the owner reviewing it.

## Decision

Seed entries are `draft: true` (render in dev with a badge, hidden in prod)
by default. Exactly one clearly SAMPLE-labeled entry per collection is
published (`draft: false`) so every route and layout renders on the live
site and e2e tests can exercise them. Users replace or delete them.

## Consequences

- Prod home shows one "Sample Post/Project/Book/Paper" — obviously labeled.
- Empty states exist for prod views with nothing published.
- To go fully clean: delete the sample files (documented in content-guide).
