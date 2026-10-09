---
# SAMPLE CONTENT — replace this file with a real post.
title: "Sample Post: Go Patterns I Keep Reusing"
description: "A sample post demonstrating headings, tables, and lists. Replace me with a real post."
date: 2026-08-05
tags: ["golang", "sample"]
draft: true
---

Sample content. Delete and replace — this one shows tables and lists.

## Small interfaces, late wiring

The pattern that keeps paying off: define the interface at the consumer, wire
the implementation at the edge.

| Pattern | Use it when | Watch out for |
| --- | --- | --- |
| Functional options | Optional config grows | Defaults buried deep |
| Consumer interfaces | Only one method needed | Don't export it |
| Sentinel errors | Callers need `errors.Is` | Wrapping loses identity |

## Checklist before merging

- [ ] Errors wrapped with context
- [ ] Context propagated, never stored
- [ ] Table-driven tests for the tricky branches