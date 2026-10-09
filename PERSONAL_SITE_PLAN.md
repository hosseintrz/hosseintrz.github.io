# Task: Build my personal website (blog, resume, projects, library)

You are building a personal website as a **static site deployed free on GitHub Pages**. It must be minimal, dark-first with a light/dark/system toggle, smooth, and visually unique. English only.

## How to work

- Work in phases, in order. Verify each phase (`npm run check`) before moving on, and commit after each with a conventional commit message.
- Where I marked a choice **[DEFAULT]**, use it unless I override it. If something is unspecified, choose the simplest option, record it as an ADR in `docs/decisions/`, and continue. Only stop to ask if truly blocked.
- Content is data. Every section is driven by files (Markdown, YAML, JSON) so I can update the site without touching components.
- Nothing ships as a non-working placeholder, except sample content clearly marked `draft: true` or `SAMPLE`.

## Decisions

| Area | Decision |
|---|---|
| Framework | Astro (latest stable), TypeScript strict **[DEFAULT]** |
| Styling | Tailwind CSS with design tokens as CSS variables **[DEFAULT]** |
| Content | Astro Content Collections with Zod schemas, Markdown/MDX + YAML/JSON |
| Interactivity | Astro islands; vanilla TS first, Preact only where needed **[DEFAULT]** |
| Page transitions | Astro View Transitions (ClientRouter) |
| Search | Pagefind (static, no server) **[DEFAULT]** |
| Comments | giscus (GitHub Discussions), optional, off by default **[DEFAULT]** |
| Analytics | GoatCounter or none, off by default **[DEFAULT]** |
| Hosting | GitHub Pages via GitHub Actions |
| Repo name | `<username>.github.io` |
| Language | English only, no i18n |
| Package manager | pnpm **[DEFAULT]** |

## Sections and routes

```
/                      Home: intro, featured projects, latest posts, currently reading
/about                 Career story and values
/resume                Web resume + Download PDF
/blog                  Post list, tag filter
/blog/<slug>           Post
/blog/tags/<tag>       Tag archive
/projects              Project grid with filters
/projects/<slug>       Project detail page (case study)
/library               Hub: Books and Papers
/library/books         Books I've read (ratings, notes) + Recommendations
/library/papers        Papers I've read (with my notes)
/now                   What I'm doing / reading / learning right now
/uses                  Tools, setup, stack (optional page)
/rss.xml               Blog feed
/sitemap-index.xml     Auto
/404                   Custom, on-brand
```

## Content model (Zod schemas in `src/content/config.ts`)

**blog** (Markdown/MDX): `title, description, date, updated?, tags[], draft, cover?, canonicalUrl?`. Reading time computed automatically.

**projects** (Markdown/MDX): `title, summary, date, status (active|shipped|archived|idea), stack[], links{repo?, demo?, writeup?}, featured, cover?, order?`.

**books** (YAML or JSON collection): `title, author, status (read|reading|want), rating (1-5)?, dateFinished?, recommended (bool), tags[], oneLiner, notesSlug?, cover?`.
Two views from the same data: **Read** (everything with status read) and **Recommended** (recommended: true, with why).

**papers** (YAML or JSON collection): `title, authors[], year, venue?, url, status (read|reading|queue), tags[], takeaway, notesSlug?`.

**resume** (single `resume.yaml`): basics, summary, experience[], education[], skills (grouped), projects (refs), certifications, links. Rendered as the web page and as the PDF from the same data.

**now**: a single Markdown file with `updated` date.

Seed every collection with 2-3 clearly marked SAMPLE entries so every page renders.

## Design direction

**Principles:** minimal, calm, typographic, fast. Content first; decoration is subtle and purposeful. It should feel crafted, not templated.

**Theme system**
- Tokens as CSS variables on `:root`: surface (3 levels), text (3 levels), border, accent, accent-soft, success/warn/danger, radius, spacing scale, shadow, motion durations/easings.
- Modes: **dark (default)**, light, system. A toggle in the header cycles/chooses; preference persists in `localStorage`.
- Prevent flash of wrong theme: tiny inline script in `<head>` sets `data-theme` before paint.
- **Customizable accent:** 5-6 accent presets (e.g. violet, cyan, lime, amber, rose, mono) selectable from a small settings popover, persisted. All colors derive from tokens so a new theme is one block of variables.
- Meet WCAG AA contrast in every theme and accent preset (verify with a script in CI).

**Typography**
- One characterful display face for headings plus a clean text face and a mono face for code/meta. Self-host fonts (WOFF2, subsetted, `font-display: swap`). **[DEFAULT]** e.g. a refined grotesk or serif for headings, Inter or similar for text, JetBrains Mono for code.
- Generous line height, ~65ch measure for prose, fluid type scale with `clamp()`.

**Layout**
- Single centered column for reading (narrow), wider grid for projects/library. Lots of whitespace. Sticky minimal header, quiet footer.
- Mobile-first, fully responsive, no horizontal scroll.

**Unique touches (keep each subtle and optional via reduced motion)**
- Soft cursor-following ambient glow behind the hero (disabled on touch and reduced-motion).
- Very faint grain/noise texture overlay in dark mode.
- A command palette (`Cmd/Ctrl+K`) for search and navigation: jump to any page, post, project, book, or toggle theme. Built on Pagefind + a static route index.
- Staggered fade/slide-up on section entry (IntersectionObserver, CSS-only transitions).
- Hover states with small physical feel: link underline sweeps, card lift with border-glow.
- Page transitions via View Transitions with a short cross-fade, shared-element transition for project cards into their detail page where supported.
- Library page: book shelf view with spines/covers and a toggle to a compact list; reading-progress ring on "currently reading".
- Blog post: reading progress bar, auto table of contents with active-section highlight, copy button on code blocks, nice footnotes, heading anchor links.
- Custom 404 with personality.

**Motion rules:** durations 150-300ms, one shared easing curve, respect `prefers-reduced-motion` everywhere, nothing blocks interaction, no layout shift.

**Performance and accessibility targets:** Lighthouse 95+ on all four categories, LCP < 1.5s, CLS ~0, JS minimal (islands only), semantic HTML, visible focus rings, skip link, full keyboard navigation, alt text required for images.

## Phases

### Phase 0: Foundation
1. Init Astro + TypeScript strict + Tailwind + ESLint + Prettier + `astro check`.
2. Scripts: `dev`, `build`, `preview`, `lint`, `format`, `typecheck`, `test`, `check` (lint + typecheck + build + tests).
3. Configure `site` and `base` for GitHub Pages; sitemap and RSS integrations.
4. Pin Node version (`.nvmrc`). Commit.

**Done when:** `pnpm check` passes on a clean clone.

### Phase 1: Design system
1. Implement tokens, the three theme modes, no-flash script, accent presets, and the settings popover.
2. Build base components: `Container`, `Header`, `Footer`, `ThemeToggle`, `AccentPicker`, `Button`, `Link`, `Tag`, `Card`, `Prose` (styles for rendered Markdown), `Section`, `Badge`, `Icon`.
3. Add a hidden `/design` route showing every component in every theme and accent.
4. Contrast-check script across theme x accent combinations; fails CI below AA.
5. Write `docs/design-system.md`: principles, tokens, usage rules, do/don't.

**Done when:** `/design` renders correctly in all modes and the contrast check passes.

### Phase 2: Content layer
1. Define all collections and Zod schemas. Build with sample content.
2. Write small, pure utility functions (reading time, sorting, filtering, grouping by year/tag) **test-first** with Vitest.
3. Write `docs/content-guide.md`: exactly how to add a post, project, book, paper, and update the resume and now page.

**Done when:** schema validation fails the build on bad frontmatter, and utilities are tested.

### Phase 3: Pages
1. Home, About, Now, Uses, 404.
2. Blog list (with tag filter), post page (TOC, progress bar, code copy, prev/next, related posts), tag archives, RSS.
3. Projects grid (filter by stack/status) and detail pages.
4. Library hub, Books (read list, rating, shelf/list toggle, Recommended view), Papers (sortable by year/status/tag, notes link).
5. Resume page from `resume.yaml`, print-friendly stylesheet, and a **build-time PDF generation** step (Playwright or similar) producing `/resume.pdf` from the page.

**Done when:** every route renders with sample data, has correct titles/meta, and passes accessibility checks.

### Phase 4: Polish and delight
1. Command palette with Pagefind search plus navigation and actions.
2. View transitions, entry animations, hover details, ambient glow, grain, reading progress, and all items from "Unique touches", all respecting reduced motion.
3. SEO: per-page meta, canonical URLs, Open Graph and Twitter cards with auto-generated OG images per post (build-time), JSON-LD for Person and BlogPosting.
4. Optional, disabled by default and toggled in `site.config.ts`: giscus comments, GoatCounter analytics.

**Done when:** Lighthouse targets met locally and motion is disabled correctly with reduced-motion on.

### Phase 5: Quality and CI/CD
1. Tests: Vitest for utilities, Playwright for smoke tests (each route loads, theme toggle persists across reload, command palette opens and navigates, no console errors), axe accessibility check on key pages.
2. GitHub Actions `ci.yml` on PRs: install (cached), lint, typecheck, build, tests, contrast check, link checker, Lighthouse CI with thresholds.
3. GitHub Actions `deploy.yml` on push to `main`: build and deploy to GitHub Pages via the official `actions/deploy-pages`.
4. Dependabot config, PR template.
5. Write `docs/deployment.md`: how Pages is configured, custom domain steps, rollback by reverting a commit.

**Done when:** a push to `main` deploys, and the live site loads at `https://<username>.github.io`.

### Phase 6: Agent infrastructure
1. `AGENTS.md` (under 120 lines; `CLAUDE.md` contains only `@AGENTS.md`). Include: stack, commands, content locations, and hard rules:
   - Content changes go in `src/content/` and `src/data/`, never hardcoded in components.
   - Use design tokens only; no hardcoded colors, spacing, or font sizes.
   - Respect `prefers-reduced-motion` for any new animation.
   - New utilities need tests first.
   - Ask before adding a dependency; prefer zero or minimal client JS.
   - Run `pnpm check` before declaring a task done.
2. Skills in `.claude/skills/`: `new-blog-post`, `add-project`, `add-book`, `add-paper`, `update-resume`, `add-component`, `update-now-page`. Each lists exact file paths, required fields, and a checklist.
3. A `reviewer` subagent that checks diffs against the AGENTS.md rules.
4. ADRs in `docs/decisions/` for each row of the Decisions table and for the theme and motion approach.
5. Pre-commit hook (lefthook) running format, lint, and typecheck.

**Done when:** an agent given "add a blog post about X" or "add this book to my read list" completes it correctly using only AGENTS.md and the skills.

### Phase 7: Handover
1. `README.md`: quickstart, how to write content, how to deploy, how to change accent/theme.
2. Verify a clean-clone flow: install, dev, build, deploy workflow green.

## Placeholders I will fill in later

Replace these before launch; until then use obvious sample values:
- My name, tagline, bio, photo, and social links (`site.config.ts`)
- Resume content, real projects, real books and papers
- Final accent color preference and fonts (swap by editing tokens only)

## Final acceptance checklist

- [ ] `pnpm check` passes on a clean clone
- [ ] All routes in "Sections and routes" exist and render with sample data
- [ ] Theme toggle: dark default, light, system; no flash on load; accent presets work and persist
- [ ] All theme and accent combinations pass AA contrast
- [ ] Command palette works with search and keyboard navigation
- [ ] Reduced motion respected; keyboard and screen reader basics verified
- [ ] Lighthouse 95+ across categories on key pages
- [ ] Resume page and PDF generated from the same data
- [ ] CI and deploy workflows pass; site is live on GitHub Pages
- [ ] AGENTS.md, skills, ADRs, and content guide are complete
- [ ] No hardcoded colors/spacing anywhere outside the token file

## Output expected from you

When finished, reply with: (1) the repo tree, (2) the [DEFAULT] choices you used, (3) anything you could not verify, and (4) questions I still need to answer (name and bio, fonts and accent, comments/analytics on or off).
