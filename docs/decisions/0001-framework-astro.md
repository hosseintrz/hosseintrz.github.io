# ADR 0001 — Framework: Astro (latest stable) + TypeScript strict

**Status:** Accepted
**Date:** 2026-10-09

## Context

A personal site with blog, projects, library, resume — mostly content, light
interactivity, must deploy free on GitHub Pages, and stay fast.

## Decision

Astro 5 with static output and `astro check` under a strict TS config.

## Consequences

- Zero-JS by default; islands only where interactive.
- Content Collections fit the "content is data" requirement natively.
- Node/type versions pinned in `.nvmrc`/`tsconfig.json`.
