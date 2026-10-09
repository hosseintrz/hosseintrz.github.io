/** Books page: shelf ↔ list toggle, persisted in localStorage. */

const KEY = 'booksView';

function apply(view: string): void {
  const root = document.querySelector('[data-books-view]');
  if (!root) return;
  const shelf = document.querySelector<HTMLElement>('[data-books-shelf]');
  const list = document.querySelector<HTMLElement>('[data-books-list]');
  const isList = view === 'list';
  if (shelf) shelf.classList.toggle('hidden', isList);
  if (list) list.classList.toggle('hidden', !isList);
  root.querySelectorAll<HTMLButtonElement>('[data-view]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.view === view));
  });
}

function setupBooksView(): void {
  const root = document.querySelector('[data-books-view]');
  if (!root) return;
  let view = 'shelf';
  try {
    view = localStorage.getItem(KEY) === 'list' ? 'list' : 'shelf';
  } catch {
    /* private mode */
  }
  apply(view);

  root.addEventListener('click', (e) => {
    const btn = e.target instanceof Element ? e.target.closest<HTMLButtonElement>('[data-view]') : null;
    if (!btn) return;
    const next = btn.dataset.view ?? 'shelf';
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* private mode */
    }
    apply(next);
  });
}

setupBooksView();
document.addEventListener('astro:page-load', setupBooksView);