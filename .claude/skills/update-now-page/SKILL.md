---
name: update-now-page
description: Update the /now page (src/content/now/now.md) with current work, learning, reading.
---

# Update the now page

1. Edit `src/content/now/now.md` (single Markdown file).
2. Keep frontmatter minimal — bump `updated:` to today's date whenever content changes:

```markdown
---
updated: YYYY-MM-DD
---
```

3. Sections in the body (keep them short and current): Working / Learning /
   Reading / Elsewhere.

## Checklist

- [ ] `updated` date bumped
- [ ] Content reflects what is true TODAY (this page goes stale fast — be honest)
- [ ] `pnpm check` passes
- [ ] Renders on `/now/`
