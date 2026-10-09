# ADR 0007 — Comments: giscus, off by default

**Status:** Accepted
**Date:** 2026-10-09

## Context

Plan: giscus optional, disabled by default.

## Decision

`src/components/Comments.astro` renders the giscus script only when
`features.comments.enabled` is true in `src/config/site.ts` AND the repo ids
are set. Wired into the post page; ships disabled.

## Consequences

- Zero external requests until enabled.
- Enabling requires a public repo with Discussions and giscus app installed.
