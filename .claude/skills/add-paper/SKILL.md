---
name: add-paper
description: Add a paper to the library (src/data/papers/). Use when asked to add a paper.
---

# Add a paper

1. Create `src/data/papers/<slug>.yml` — one YAML file per paper.
2. Fields:

```yaml
title: "Paper Title"
authors: ["First Author", "et al."]
year: 2023
venue: "NeurIPS" # optional
url: https://arxiv.org/abs/XXXX.XXXXX # required
status: read # read | reading | queue
tags: ["ai-agents"]
takeaway: "One paragraph — what YOU got out of it. Required."
notesSlug: my-post # optional — links to blog post
draft: false
```

## Checklist

- [ ] `url` is real and reachable (arXiv, ACM, author page)
- [ ] `takeaway` is your own note, not the abstract
- [ ] `pnpm check` passes
- [ ] Shows on `/library/papers/`, filterable by status
