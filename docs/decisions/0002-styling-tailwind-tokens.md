# ADR 0002 — Styling: Tailwind CSS 4 with tokens as CSS variables

**Status:** Accepted
**Date:** 2026-10-09

## Context

Need utility workflow speed but a token-driven design system that supports
runtime theme switching (dark/light/system × 6 accents).

## Decision

Tailwind CSS 4 via `@tailwindcss/postcss`. Design tokens live in
`src/styles/tokens.css` as CSS variables; `@theme inline` in `globals.css`
maps them onto Tailwind color/radius/shadow namespaces so utilities re-skin
instantly when `<html data-theme/data-accent>` changes.

## Consequences

- PostCSS integration instead of the Vite plugin: the Tailwind Vite plugin
  targets Vite 7 while Astro 5 bundles Vite 6 (type conflict at build).
- One source of truth for tokens; components may not hardcode values.
- `scripts/check-contrast.mjs` parses the token file directly to enforce AA.
