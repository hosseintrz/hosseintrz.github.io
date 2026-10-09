# AGENTS.md — operating manual for AI agents working on this repo

Personal site of Hossein (`hosseintrz.github.io`): Astro static site on GitHub Pages.

## Stack

- Astro 5 (static output), TypeScript strict
- Tailwind CSS 4 via PostCSS; design tokens as CSS variables
- Content: Astro Content Collections + Zod
- Tests: Vitest (unit), Playwright (e2e, system Chrome)
- Package manager: pnpm (see `packageManager` field). Node version: `.nvmrc`

## Commands

| Command          | What it does                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------- |
| `pnpm dev`       | Dev server                                                                                |
| `pnpm build`     | Full build: astro build → OG images → resume PDF → pagefind index                         |
| `pnpm preview`   | Serve `dist/`                                                                             |
| `pnpm lint`      | ESLint                                                                                    |
| `pnpm format`    | Prettier write                                                                            |
| `pnpm typecheck` | `astro sync && astro check`                                                               |
| `pnpm test`      | Vitest unit tests                                                                         |
| `pnpm test:e2e`  | Playwright e2e (needs a prior `pnpm build`)                                               |
| `pnpm contrast`  | WCAG AA check across all theme × accent combos                                            |
| **`pnpm check`** | lint + typecheck + build + unit tests + contrast — **run before declaring any task done** |

## Content locations (content is data — never hardcode it in components)

| Content                       | File(s)                                                     |
| ----------------------------- | ----------------------------------------------------------- |
| Blog posts                    | `src/content/blog/*.md`                                     |
| Projects                      | `src/content/projects/*.md`                                 |
| Books                         | `src/data/books/*.yml` (one file per book)                  |
| Papers                        | `src/data/papers/*.yml`                                     |
| Resume                        | `src/data/resume.yaml` (drives `/resume` AND `/resume.pdf`) |
| Now page                      | `src/content/now/now.md`                                    |
| Site identity + feature flags | `src/config/site.ts`                                        |
| Schemas (Zod)                 | `src/content.config.ts`                                     |

Step-by-step recipes live in `.claude/skills/` (new-blog-post, add-project,
add-book, add-paper, update-resume, update-now-page, add-component).
Full content how-to: `docs/content-guide.md`.

## Design system

- Every color/radius/shadow/duration is a token in `src/styles/tokens.css`,
  mapped to Tailwind utilities in `src/styles/globals.css` (`@theme inline`).
- Themes: `dark` (default) / `light` / `system` on `<html data-theme>`;
  accents: violet/cyan/lime/amber/rose/mono on `<html data-accent>`.
  Client logic: `src/scripts/ui.ts`. No-flash inline script: `BaseLayout.astro`.
- Icons: `src/lib/icons.ts` + `src/components/Icon.astro`.
- Repeated component classes live in `@layer components` in `globals.css`.
- `pnpm contrast` must stay green (12 combos × 14 text pairs, ≥ 4.5:1).

## Hard rules

1. Content changes go in `src/content/` and `src/data/` — never hardcoded in components.
2. Use design tokens only; no hardcoded colors, spacing, or font sizes.
   (Sole exceptions: print styles block, `public/favicon.svg`.)
3. Respect `prefers-reduced-motion` for any new animation; durations use
   `--dur-*` tokens and the shared `--ease` curve.
4. New utilities in `src/lib/` need tests first (`*.test.ts`, Vitest).
5. Ask before adding a dependency; prefer zero or minimal client JS.
6. Run `pnpm check` before declaring a task done.
7. `draft: true` content renders in dev only and is hidden in prod builds.
   Don't present draft content as if it were live.
8. Conventional commit messages; commit per logical task.
9. `/design` page is the visual test bench — new components should appear there.

## Review

Before finishing a diff, check it against every hard rule above. The
`reviewer` subagent (`.claude/agents/reviewer.md`) does this mechanically.
