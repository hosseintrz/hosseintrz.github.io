---
name: add-component
description: Add a new UI component the right way (tokens, a11y, /design showcase).
---

# Add a component

1. Create `src/components/<Name>.astro`.
2. Follow the design system (`docs/design-system.md`):
   - Tokens only — no hardcoded colors/spacing/font sizes (use Tailwind
     utilities mapped in `globals.css` or `var(--token)`).
   - Reusable CSS classes go in `@layer components` in `globals.css`.
   - Motion: `--dur-*` tokens + `--ease`; respect `prefers-reduced-motion`.
3. Accessibility: semantic element, focus-visible styles, aria labels for
   icon-only buttons, keyboard operable.
4. Add a showcase section to `/design` (src/pages/design.astro).
5. If the component needs client JS: delegate events at document level or
   re-init on `astro:page-load` (see `src/scripts/ui.ts` for the pattern).
6. New icons go in `src/lib/icons.ts` (stroke paths, 24 viewBox).

## Checklist

- [ ] No hardcoded colors/spacing (tokens only)
- [ ] Focus + keyboard support verified
- [ ] Reduced-motion respected for any animation
- [ ] Shown on `/design`
- [ ] `pnpm check` passes
