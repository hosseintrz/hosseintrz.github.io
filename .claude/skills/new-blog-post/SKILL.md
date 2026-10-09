---
name: new-blog-post
description: Create a new blog post in src/content/blog/. Use when asked to write/publish a post.
---

# New blog post

1. Create `src/content/blog/<slug>.md` — slug is the permanent URL, lowercase-kebab, stable.
2. Required frontmatter:

```markdown
---
title: "Post Title"
description: "One-sentence summary (used in lists, meta, OG)."
date: YYYY-MM-DD
tags: ["lowercase-kebab"]
draft: false
---
```

Optional: `updated` (date), `cover` (path), `canonicalUrl` (URL). 3. Read `docs/content-guide.md` if unsure about fields.

## Checklist

- [ ] Slug has no spaces/uppercase
- [ ] `description` is a real sentence (it becomes meta description + OG text)
- [ ] Tags lowercase-kebab; reuse existing tags from `/blog/` when sensible
- [ ] Headings start at `##` (h2) — the post `<h1>` is the title
- [ ] No task-list syntax (`- [ ]`) — renders unlabeled checkboxes (a11y)
- [ ] `pnpm check` passes
- [ ] Draft? set `draft: true` (renders in dev only) — never publish placeholders
