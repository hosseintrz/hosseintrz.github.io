# ADR 0013 — Theme system: tokens + mode + accent presets

**Status:** Accepted
**Date:** 2026-10-09

## Context

Dark-first site with dark/light/system modes and 6 selectable accents, no
flash of wrong theme, AA contrast everywhere.

## Decision

- Modes on `<html data-theme>` (dark default, light, system), accents on
  `<html data-accent>` (violet default; cyan, lime, amber, rose, mono).
- All values are CSS variables in `src/styles/tokens.css`; dark values are
  the `:root` defaults, light overrides in `[data-theme='light']`, accents
  override `--accent`/`--accent-contrast` per mode (plus `--swatch-*` for the
  picker). Derived tints via `color-mix()` never need per-accent overrides.
- No-flash inline script in `BaseLayout.astro` sets both attributes from
  `localStorage` before first paint; `ui.ts` re-applies after view swaps.
- `scripts/check-contrast.mjs` builds all 12 theme×accent combos and fails
  under 4.5:1 on any text pair.

## Consequences

- A new accent is ~8 lines of tokens + one array entry.
- `color-scheme` follows the mode for native widgets/scrollbars.
