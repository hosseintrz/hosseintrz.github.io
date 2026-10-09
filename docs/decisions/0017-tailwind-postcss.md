# ADR 0017 — Tailwind via PostCSS, not the Vite plugin

**Status:** Accepted
**Date:** 2026-10-09

## Context

Tailwind 4 ships `@tailwindcss/vite`, but it targets Vite 7 while Astro 5
bundles Vite 6 — `astro check` fails on incompatible plugin types.

## Decision

Use `@tailwindcss/postcss` with a root `postcss.config.mjs` (Astro's built-in
PostCSS pipeline).

## Consequences

- Fully type-compatible build; identical utility output.
- No custom Vite plugins in the Astro config at all.
