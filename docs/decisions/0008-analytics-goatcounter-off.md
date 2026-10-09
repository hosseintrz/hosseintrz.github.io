# ADR 0008 — Analytics: GoatCounter, off by default

**Status:** Accepted
**Date:** 2026-10-09

## Context

Plan: GoatCounter or none, off by default.

## Decision

`src/components/Analytics.astro` injects the GoatCounter script only when
`features.analytics.enabled` is true in `src/config/site.ts`. Ships disabled.

## Consequences

- No tracking requests by default.
- GoatCounter chosen over heavier options for being lightweight and privacy-friendly.
