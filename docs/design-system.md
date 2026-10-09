# Design system

The site's visual language is built from **tokens**. Components never hardcode
colors, radii, shadows, or durations — they consume CSS variables (directly or
via Tailwind utilities mapped in `src/styles/globals.css`).

## Where things live

| What | Where |
|---|---|
| All design tokens | `src/styles/tokens.css` |
| Tailwind theme mapping + base/component/prose styles | `src/styles/globals.css` |
| Icon set | `src/lib/icons.ts` + `src/components/Icon.astro` |
| Component classes (`.btn`, `.card`, `.tag`, `.badge`, `.link`, `.nav-link`, `.popover`, `.prose`) | `@layer components` in `globals.css` |
| Theme/accent client logic | `src/scripts/ui.ts` |
| Live showcase + test bench | `/design` (hidden from nav, linked in footer) |
| Contrast gate | `scripts/check-contrast.mjs` (runs in `pnpm check` and CI) |

## Tokens

**Surfaces** (3 levels): `--surface-0` (page), `--surface-1` (cards), `--surface-2` (raised/code).

**Text** (3 levels): `--text-1` (primary), `--text-2` (secondary), `--text-3` (muted/meta).

**Borders**: `--border`, `--border-strong`.

**Accent system**: `--accent`, `--accent-contrast` (text on accent), plus derived tints
`--accent-soft` / `--accent-soft-strong` / `--accent-border` (computed via `color-mix`,
never overridden per accent).

**Status**: `--success`, `--warn`, `--danger`.

**Radius**: `--r-sm` `--r-md` `--r-lg` `--r-full` (mapped to Tailwind's `rounded-*`).

**Shadows**: `--shadow-card`, `--shadow-lift` (mapped to Tailwind's `shadow-sm/md`).

**Spacing**: Tailwind's default 4px scale is the spacing token set — use utilities
(`p-4`, `gap-6`, …), never magic numbers.

**Motion**: `--dur-fast` (150ms), `--dur-base` (250ms), `--dur-slow` (400ms),
one shared easing curve `--ease`. All collapse to 0 under `prefers-reduced-motion`.

## Themes

Three modes: **dark (default)**, **light**, **system**. Preference lives in
`localStorage.theme` and is applied to `<html data-theme>` by an inline no-flash
script in `BaseLayout.astro` before first paint. The toggle cycles dark → light → system.

Six **accent presets** (violet default, cyan, lime, amber, rose, mono) live in
`localStorage.accent` → `<html data-accent>`, chosen from the header popover.
A new accent is ~6 lines in `tokens.css` (dark pair + light pair + swatches).

## Usage rules

### Do

- Use tokens/Tailwind-mapped utilities only (`bg-surface-1`, `text-text-2`, `border-border`).
- Use `color-mix()` derivatives of tokens for new tints if needed — no new raw colors.
- Keep motion within the duration tokens and the shared easing curve.
- Gate any new animation behind `prefers-reduced-motion`.
- Verify text/background pairs pass 4.5:1 — run `pnpm contrast`.

### Don't

- Hardcode hex/rgb anywhere outside `tokens.css` (exception: the static favicon).
- Introduce a new font family without updating the token mapping.
- Add custom CSS that duplicates an existing component class.
- Animate layout properties (`width`, `top`, `left`); use `transform`/`opacity`.
- Set `z-index` values ad hoc: layers are header 40, grain 60, popover 50, palette 80,
  skip-link 100.

## Typography

- Display/headings: **Space Grotesk Variable** (`font-display`), tight tracking, balanced wrapping.
- Body: **Inter Variable** (`font-sans`), 1.75 line-height, `65ch` measure for prose.
- Code/meta: **JetBrains Mono Variable** (`font-mono`).
- All self-hosted via Fontsource variable packages (subsetted WOFF2 by unicode-range,
  `font-display: swap`), imported as JS modules in `BaseLayout.astro`.

## Contrast

`scripts/check-contrast.mjs` parses `tokens.css`, builds every theme × accent
combination (12), and requires ≥ 4.5:1 for every text pair, including each accent
on every surface and `--accent-contrast` on `--accent`. It fails CI below AA.
If you change a token, run `pnpm contrast` before committing.