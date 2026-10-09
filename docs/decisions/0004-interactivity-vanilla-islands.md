# ADR 0004 — Interactivity: vanilla TS islands first

**Status:** Accepted
**Date:** 2026-10-09

## Context

Interactive bits: theme/accent controls, command palette, filters, sort,
view toggle, copy-code, TOC highlight, reading progress. Preact is allowed
"only where needed".

## Decision

Vanilla TypeScript everywhere. No framework runtime at all.

## Consequences

- Scripts are bundled once and use event delegation or `astro:page-load`
  re-init to survive Astro View Transition DOM swaps (`src/scripts/ui.ts`).
- Client JS stays tiny; no hydration machinery.
- State lives in `localStorage` (theme, accent, books view).
