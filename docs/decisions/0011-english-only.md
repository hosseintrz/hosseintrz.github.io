# ADR 0011 — English only, no i18n

**Status:** Accepted
**Date:** 2026-10-09

## Context

Plan explicitly requires English-only.

## Decision

Single language; `lang="en"`; no i18n routing; date formatting via
`Intl.DateTimeFormat('en-US')`.

## Consequences

Simplest possible routing and RSS. Can revisit if content grows a second
language.
