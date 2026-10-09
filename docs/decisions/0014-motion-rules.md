# ADR 0014 — Motion rules

**Status:** Accepted
**Date:** 2026-10-09

## Context

Plan: 150–300ms durations, one easing curve, reduced-motion respected,
nothing blocks interaction, no layout shift.

## Decision

- Tokens: `--dur-fast` 150ms (hover/focus), `--dur-base` 250ms
  (cards/popovers), `--dur-slow` 400ms (entry reveals), shared
  `--ease: cubic-bezier(0.22, 1, 0.36, 1)`.
- Entry animations are JS-gated (`html.js [data-reveal]`) so non-JS renders
  fully visible; IntersectionObserver adds `.is-visible` once.
- `prefers-reduced-motion` collapses durations to 0 in tokens AND disables
  the reveal transform + cursor-following glow.

## Consequences

- Animating `transform`/`opacity` only — no layout thrash.
- The film-grain overlay is static (no animation cost).
