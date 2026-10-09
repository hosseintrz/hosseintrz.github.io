/**
 * Client-side grid filtering (projects). Toggle chips; AND across groups.
 * Document-level delegation so it survives view-transition DOM swaps.
 */

let bound = false;

function applyFilters(): void {
  const container = document.querySelector<HTMLElement>('[data-filter-container]');
  if (!container) return;

  const active: Record<string, Set<string>> = { status: new Set(), stack: new Set() };
  document
    .querySelectorAll<HTMLButtonElement>('[data-filter-kind][aria-pressed="true"]')
    .forEach((b) => active[b.dataset.filterKind as string].add(b.dataset.filterValue as string));

  const clearBtn = document.querySelector('[data-filter-clear]');
  const anyActive = Object.values(active).some((s) => s.size > 0);
  clearBtn?.classList.toggle('hidden', !anyActive);

  let visible = 0;
  container.querySelectorAll<HTMLElement>('[data-filter-item]').forEach((item) => {
    let pass = true;
    for (const [kind, set] of Object.entries(active)) {
      if (set.size === 0) continue;
      const values = (item.dataset[kind] ?? '').split(',');
      if (kind === 'stack') {
        // stack: card must contain at least one active stack value
        if (![...set].some((v) => values.includes(v))) pass = false;
      } else if (!set.has(values[0])) {
        pass = false;
      }
    }
    item.classList.toggle('hidden', !pass);
    if (pass) visible++;
  });

  const empty = container.querySelector('[data-filter-empty]');
  if (empty) empty.classList.toggle('hidden', visible > 0);
}

function setupFilters(): void {
  if (bound) return;
  bound = true;
  document.addEventListener('click', (e) => {
    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;

    if (target.closest('[data-filter-clear]')) {
      document
        .querySelectorAll<HTMLButtonElement>('[data-filter-kind][aria-pressed="true"]')
        .forEach((b) => b.setAttribute('aria-pressed', 'false'));
      applyFilters();
      return;
    }

    const btn = target.closest<HTMLButtonElement>('[data-filter-kind]');
    if (btn) {
      const pressed = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', String(!pressed));
      applyFilters();
    }
  });
}

setupFilters();