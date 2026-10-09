# ADR 0003 — Content: Astro Content Collections with Zod schemas

**Status:** Accepted
**Date:** 2026-10-09

## Context

The plan calls for `src/content/config.ts`. Astro 5's current convention is
`src/content.config.ts` with loader-based collections (glob/file).

## Decision

Use `src/content.config.ts` (Astro 5 convention) with `glob` loaders for
markdown + YAML data files. Schemas in Zod. Collections: blog, projects,
books, papers, resume, now.

## Consequences

- Bad frontmatter fails the build — schema errors surface in `pnpm check`/CI.
- YAML/JSON data collections let books/papers/resume stay pure data files.
- `draft: true` field added to every collection (extension to the plan's
  schemas — see ADR 0015).
