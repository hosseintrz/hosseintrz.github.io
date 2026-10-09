---
# SAMPLE CONTENT — replace this file with a real post.
# Drafts render in dev with a badge and are hidden in production.
title: "Sample Post: What Building AI Agents Taught Me About Token Budgets"
description: "A sample post showing off the blog layout: TOC, code blocks, footnotes, and reading progress. Replace me with a real post."
date: 2026-09-12
tags: ["ai-agents", "sample"]
draft: true
---

This is **sample content** so every page renders end to end. Delete it and write
your own post — see `docs/content-guide.md`.

## Why token budgets matter

Every agent loop burns tokens twice: once to think, once to carry context
forward. The failure mode is rarely one giant prompt — it's the slow creep of
tool results nobody trimmed.

```go
func trim(results []string, budget int) []string {
    total := 0
    kept := make([]string, 0, len(results))
    for _, r := range results {
        if total+len(r) > budget {
            break
        }
        total += len(r)
        kept = append(kept, r)
    }
    return kept
}
```

## Three rules that held up

1. Measure tokens per step, not per request.
2. Give every tool a declared cost estimate.
3. Evaluate trimming strategies like any other model parameter.

> The best context window is the one you never fill.

## What evaluation buys you

Agent evals turn vibes into regressions you can catch in CI. A cheap harness
that replays ten golden traces beats a dozen manual test sessions[^1].

[^1]: Footnote support is built into the post layout.

## Related reading

The routing post covers how requests pick a model. See also the tag archive
for more `ai-agents` posts.