---
name: add-project
description: Add a project case study to src/content/projects/. Use when asked to add a project.
---

# Add a project

1. Create `src/content/projects/<slug>.md` (slug = URL).
2. Required frontmatter:

```markdown
---
title: "Project Name"
summary: "One-liner shown on cards."
date: YYYY-MM-DD
status: active # active | shipped | archived | idea
stack: ["golang", "typescript"]
featured: false # true → shows on home (max 3 featured)
draft: false
---
```

Optional: `links: { repo, demo, writeup }` (all optional URLs), `order` (number,
lower = earlier in grid), `cover`. 3. Body: case study — Problem → Approach → Outcome.

## Checklist

- [ ] `status` uses one of the four enum values
- [ ] `summary` is a real sentence (meta description)
- [ ] At most 3 `featured: true` projects total
- [ ] Body has the three sections (problem/approach/outcome)
- [ ] `pnpm check` passes
- [ ] Card shows on `/projects/`, detail page on `/projects/<slug>/`, home if featured
