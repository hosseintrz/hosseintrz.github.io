# hosseintrz.github.io

Personal site of Hossein — blog, projects, library (books & papers), resume,
now page. Astro 5 + Tailwind CSS 4, deployed free on GitHub Pages.

## Quickstart

```sh
pnpm install
pnpm dev        # http://localhost:4321
```

Requires Node ≥ 22 (see `.nvmrc`) and pnpm (auto-selected via corepack or
`npm i -g pnpm`).

Useful commands:

| Command         | What it does                                                                       |
| --------------- | ---------------------------------------------------------------------------------- |
| `pnpm dev`      | Dev server (drafts visible, with DRAFT badges)                                     |
| `pnpm build`    | Build + OG images + `/resume.pdf` + search index                                   |
| `pnpm preview`  | Serve the production build                                                         |
| `pnpm check`    | lint + typecheck + build + unit tests + contrast — run before finishing any change |
| `pnpm test`     | Unit tests (Vitest)                                                                |
| `pnpm test:e2e` | E2E tests (Playwright; needs `pnpm build` first)                                   |
| `pnpm contrast` | WCAG AA check across every theme × accent                                          |

## Writing content

Everything on the site is data — no content lives in components.

| What                              | Where                                                           |
| --------------------------------- | --------------------------------------------------------------- |
| Blog posts                        | `src/content/blog/*.md`                                         |
| Projects                          | `src/content/projects/*.md`                                     |
| Books                             | `src/data/books/*.yml` (one file per book)                      |
| Papers                            | `src/data/papers/*.yml`                                         |
| Resume                            | `src/data/resume.yaml` (drives `/resume` **and** `/resume.pdf`) |
| Now page                          | `src/content/now/now.md`                                        |
| Site identity, nav, feature flags | `src/config/site.ts`                                            |

Full field reference and examples: **`docs/content-guide.md`**. Step-by-step
recipes for agents: `.claude/skills/`.

Mark anything unfinished with `draft: true` — it renders in `pnpm dev` (with a
badge) and is hidden from production. Delete the sample entries when you
replace them with real content.

## Themes and accents

- Theme toggle in the header cycles **dark → light → system** (dark is the
  default). Choice persists in `localStorage`.
- Accent picker (sliders icon) offers violet (default), cyan, lime, amber,
  rose, mono.
- To change defaults or add an accent preset, edit only
  `src/styles/tokens.css` — see `docs/design-system.md` and
  `docs/decisions/0013-theme-system.md`.

## Deploy

Push to `main` → GitHub Actions builds and deploys to
`https://hosseintrz.github.io` automatically. Details, custom domains, and
rollback: `docs/deployment.md`.

## Repo map

```
src/
  components/    UI pieces (Header, Footer, cards, palette…)
  config/        site identity + feature flags
  content/       blog, projects, now (markdown)
  data/          books, papers, resume (YAML)
  layouts/       BaseLayout (meta, themes, palette mount)
  lib/           pure utilities + unit tests
  pages/         routes (blog, projects, library, resume, now, 404, og…)
  scripts/       client behavior (theme, palette, filters…)
  styles/        tokens.css (design tokens) + globals.css
docs/            design system, content guide, deployment, ADRs
scripts/         build pipeline (OG/PDF/search), contrast + commit checks
tests/e2e/       Playwright smoke + a11y tests
```

## Quality gates

CI runs on every PR: lint, typecheck, build, unit + e2e tests, WCAG AA
contrast across all 12 theme×accent combos, link check, and Lighthouse ≥ 95
thresholds. Pre-commit hooks (lefthook) run prettier, eslint, and astro check.
