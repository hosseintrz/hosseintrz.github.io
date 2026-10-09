# ADR 0006 — Search: Pagefind + static index, command palette UI

**Status:** Accepted
**Date:** 2026-10-09

## Context

Need static, no-server search across posts/projects and a Cmd+K palette.

## Decision

Pagefind indexes only pages marked `data-pagefind-body` (posts, projects,
about, now) — run in postbuild via the `pagefind` npm JS API. The palette
(`src/components/CommandPalette.astro`) lazily imports `/pagefind/pagefind.js`
on first open and combines results with a static `/search-index.json`
(routes, posts, projects, books, papers) plus quick actions.

## Consequences

- Dev mode has no pagefind bundle (postbuild didn't run) — palette degrades
  to static-index navigation gracefully.
- Only real content is searchable; tooling pages (`/design`, `/og/*`) excluded.
