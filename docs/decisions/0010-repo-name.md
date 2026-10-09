# ADR 0010 — Repo name: hosseintrz.github.io

**Status:** Accepted
**Date:** 2026-10-09

## Context

User Pages site: repo must be named `<username>.github.io` to serve at the
apex domain `https://hosseintrz.github.io`.

## Decision

Repo `hosseintrz/hosseintrz.github.io`, served from domain root — so no
`base` path is needed in the Astro config, and all internal links are
root-relative.

## Consequences

- Simplest URLs (`/blog/<slug>/`).
- Project (non-user) Pages would need a `base` — not applicable here.
