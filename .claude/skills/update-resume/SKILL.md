---
name: update-resume
description: Edit the resume (src/data/resume.yaml) which drives both /resume and /resume.pdf.
---

# Update the resume

1. Edit `src/data/resume.yaml` — the single source of truth for the web resume
   AND the generated PDF. Never edit the PDF directly.
2. Structure:
   - `basics` — name, role, tagline, contact links, photo.
   - `summary` — top paragraph.
   - `experience[]` — one entry per company, newest first. Inside each company,
     `teams[]` lists each team: `name`, `period` (e.g. "Feb 2024 — Feb 2025"),
     `summary`, `highlights[]` (the vital work items), `stack[]`.
   - `education[]`, `skills[]` (grouped), `projects[]`, `certifications[]`,
     `links[]`, `updated`.
3. After editing, bump the `updated:` date at the bottom.

## Checklist

- [ ] Reverse-chronological order (newest team/company first)
- [ ] Every team has `highlights` with concrete work items
- [ ] YAML strings containing `: ` are quoted (parser breaks otherwise)
- [ ] `updated` date bumped
- [ ] `pnpm check` passes (build generates `/resume.pdf` — verify no errors)
- [ ] Review `dist/resume.pdf` renders correctly (build step prints progress)
