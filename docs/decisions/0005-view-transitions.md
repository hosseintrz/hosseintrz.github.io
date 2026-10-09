# ADR 0005 — Page transitions: Astro View Transitions (ClientRouter)

**Status:** Accepted
**Date:** 2026-10-09

## Context

Plan requires view transitions with cross-fade and shared-element transitions
for project cards → detail.

## Decision

`<ClientRouter />` in `BaseLayout`. Project cards and detail headers share
`transition:name="project-<slug>"`. Client scripts listen to
`astro:after-swap` / `astro:page-load` to re-apply stored theme and re-init.

## Consequences

- New `<html>` attributes after swap come from static HTML — `ui.ts`
  re-applies `data-theme`/`data-accent` on `astro:after-swap` to prevent
  theme flash between navigations.
- All interactive components must be swap-safe (delegation or re-init).
