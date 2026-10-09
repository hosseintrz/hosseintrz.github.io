---
name: add-book
description: Add a book to the library (src/data/books/). Use when asked to add a book to the read list.
---

# Add a book

1. Create `src/data/books/<slug>.yml` — one YAML file per book (slug lowercase-kebab).
2. Fields:

```yaml
title: "Book Title"
author: "Author Name"
status: read # read | reading | want
rating: 4 # optional, 1–5, only meaningful for status: read
dateFinished: 2026-05-20 # optional
recommended: true # true → appears in the Recommended view
tags: ["architecture"]
oneLiner: "One-sentence verdict — required."
progress: 60 # optional, 0–100, only for status: reading (progress ring)
notesSlug: my-post # optional — links to blog post /blog/<notesSlug>/
draft: false
```

## Checklist

- [ ] `oneLiner` is your own opinion, not the back cover
- [ ] `rating` only for `status: read`; `progress` only for `status: reading`
- [ ] `recommended: true` needs a real `oneLiner` reason
- [ ] `pnpm check` passes
- [ ] Shows on `/library/books/` (+ Recommended section if recommended)
