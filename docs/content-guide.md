# Content guide

Every section of the site is driven by files. **Never hardcode content in
components.** This guide covers the exact files and required fields for each
type of content.

All collections support `draft: true` — drafts render in `pnpm dev` (with a
DRAFT badge) and are hidden from production builds. To publish: set
`draft: false` (or remove the field).

## Add a blog post

Create `src/content/blog/<slug>.md` (slug = URL, keep it stable):

```markdown
---
title: "My Post Title"
description: "One-sentence summary used in lists and meta tags."
date: 2026-10-09
tags: ["golang", "testing"]
draft: false
---

Body in markdown. Optional fields: `updated`, `cover`, `canonicalUrl`.
```

- Reading time is computed automatically from the body.
- Tags are lowercase-kebab; they get archive pages at `/blog/tags/<tag>`.
- Delete `draft: true` to publish. New post appears on `/blog`, home,
  `/blog/tags/<tag>`, RSS, sitemap, and the command palette automatically.

## Add a project

Create `src/content/projects/<slug>.md`:

```markdown
---
title: "Project Name"
summary: "One-liner shown on cards."
date: 2026-10-09
status: active   # active | shipped | archived | idea
stack: ["golang", "typescript"]
links:
  repo: https://github.com/you/repo      # optional
  demo: https://demo.example.com          # optional
  writeup: https://example.com/post       # optional
featured: true    # show on home page (max 3)
order: 1          # optional: manual ordering, lower = earlier
draft: false
---

Full case study: problem → approach → outcome.
```

## Add a book

Create `src/data/books/<slug>.yml` (one file per book):

```yaml
title: "Book Title"
author: "Author Name"
status: read          # read | reading | want
rating: 5             # optional, 1–5 (only for status: read)
dateFinished: 2026-05-20   # optional
recommended: true     # shows in the Recommended view
tags: ["architecture"]
oneLiner: "One-sentence verdict."
notesSlug: my-notes   # optional: links to a blog post
draft: false
```

Shows up on `/library/books` (Read + Recommended views). Books with
`status: reading` get the progress treatment on `/library`.

## Add a paper

Create `src/data/papers/<slug>.yml` (one file per paper):

```yaml
title: "Paper Title"
authors: ["First Author", "Second Author"]
year: 2023
venue: "NeurIPS"            # optional
url: https://arxiv.org/abs/XXXX.XXXXX
status: read                # read | reading | queue
tags: ["ai-agents"]
takeaway: "Your one-paragraph note — what you got out of it."
notesSlug: paper-notes      # optional: links to a blog post
draft: false
```

Shows up on `/library/papers`, sortable by year/status/tag.

## Update the resume

Edit `src/data/resume.yaml`. It drives both `/resume` and `/resume.pdf`
(generated at build time from the same data — never edit the PDF).

- `basics` — name, role, contact links, photo.
- `summary` — the top paragraph.
- `experience[]` — one entry per company; `teams[]` inside each company
  holds period, summary, `highlights[]` (the vital work per team) and `stack[]`.
- `education[]`, `skills[]`, `projects[]`, `certifications[]`, `links[]`.
- Bump `updated` when you edit.

## Update the now page

Edit `src/content/now/now.md`. Update the `updated:` date in frontmatter
whenever you change it.

## Schema changes

Schemas live in `src/content.config.ts` (Zod). Bad frontmatter fails the
build (`pnpm check` / CI catches it). Add a field → make it optional with a
default so old content keeps building.

## What syncs automatically

Adding/editing content requires no component changes. Blog posts update:
`/blog`, tag archives, home "latest posts", RSS, sitemap, search index,
command palette. Projects update: grid, filters, home featured, search.
Books/papers update: library pages, home "currently reading".