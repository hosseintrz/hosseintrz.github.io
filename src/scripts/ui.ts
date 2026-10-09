/**
 * Global client behavior: theme + accent sync, entry animations.
 * Loaded once via BaseLayout; survives view-transition navigations by
 * re-syncing on astro:after-swap / astro:page-load and using event
 * delegation for clicks.
 */
import { svgFor, type IconName } from '@/lib/icons';

type Pref = 'dark' | 'light' | 'system';
type Mode = 'dark' | 'light';

const ORDER: Pref[] = ['dark', 'light', 'system'];
const PREF_ICONS: Record<Pref, IconName> = { dark: 'moon', light: 'sun', system: 'monitor' };
export const ACCENTS = ['violet', 'cyan', 'lime', 'amber', 'rose', 'mono'] as const;

const media = window.matchMedia('(prefers-color-scheme: light)');

export function getPref(): Pref {
  try {
    const v = localStorage.getItem('theme');
    if (v === 'light' || v === 'system' || v === 'dark') return v;
  } catch {
    /* private mode */
  }
  return 'dark';
}

export function getAccent(): string {
  try {
    const v = localStorage.getItem('accent');
    if (v && (ACCENTS as readonly string[]).includes(v)) return v;
  } catch {
    /* private mode */
  }
  return 'violet';
}

export function effectiveMode(pref: Pref): Mode {
  return pref === 'system' ? (media.matches ? 'light' : 'dark') : pref;
}

/** Apply a theme preference: persist, set attribute, sync UI, notify listeners. */
export function applyPref(pref: Pref): void {
  try {
    localStorage.setItem('theme', pref);
  } catch {
    /* private mode */
  }
  document.documentElement.dataset.theme = effectiveMode(pref);
  syncThemeUI();
  document.dispatchEvent(new CustomEvent('site:theme', { detail: { pref, mode: effectiveMode(pref) } }));
}

/** Apply an accent preset: persist, set attribute, sync UI. */
export function setAccent(accent: string): void {
  if (!(ACCENTS as readonly string[]).includes(accent)) return;
  try {
    localStorage.setItem('accent', accent);
  } catch {
    /* private mode */
  }
  document.documentElement.dataset.accent = accent;
  syncAccentUI();
  document.dispatchEvent(new CustomEvent('site:accent', { detail: { accent } }));
}

export function syncThemeUI(): void {
  const pref = getPref();
  document.querySelectorAll<HTMLElement>('[data-theme-toggle]').forEach((btn) => {
    const icon = btn.querySelector<HTMLElement>('[data-theme-icon]');
    if (icon) icon.innerHTML = svgFor(PREF_ICONS[pref]);
    btn.setAttribute('aria-label', `Theme: ${pref}. Activate to cycle to the next theme.`);
    btn.title = `Theme: ${pref}`;
  });
}

export function syncAccentUI(): void {
  const accent = getAccent();
  document.querySelectorAll<HTMLElement>('[data-accent-picker]').forEach((picker) => {
    picker.querySelectorAll<HTMLButtonElement>('[data-accent-option]').forEach((opt) => {
      const selected = opt.dataset.accentOption === accent;
      opt.setAttribute('aria-checked', String(selected));
      const check = opt.querySelector<HTMLElement>('[data-accent-check]');
      if (check) check.classList.toggle('hidden', !selected);
    });
  });
}

/* ---- click delegation (works across view-transition DOM swaps) ---- */
document.addEventListener('click', (e) => {
  const target = e.target instanceof Element ? e.target : null;
  if (!target) return;

  const toggle = target.closest('[data-theme-toggle]');
  if (toggle) {
    applyPref(ORDER[(ORDER.indexOf(getPref()) + 1) % ORDER.length]);
    return;
  }

  const option = target.closest<HTMLButtonElement>('[data-accent-option]');
  if (option) {
    const id = option.dataset.accentOption;
    if (id) setAccent(id);
    const picker = option.closest('details');
    if (picker) picker.open = false;
    return;
  }

  // close open accent pickers when clicking elsewhere
  document.querySelectorAll<HTMLDetailsElement>('details[data-accent-picker]').forEach((d) => {
    if (d.open && !d.contains(target)) d.open = false;
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll<HTMLDetailsElement>('details[data-accent-picker]').forEach((d) => {
      d.open = false;
    });
  }
});

/* follow the system when preference is 'system' */
media.addEventListener('change', () => {
  if (getPref() === 'system') {
    document.documentElement.dataset.theme = effectiveMode('system');
    syncThemeUI();
  }
});

/* re-apply stored theme after a view-transition swap (new <html> attrs are from the static page) */
document.addEventListener('astro:after-swap', () => {
  document.documentElement.dataset.theme = effectiveMode(getPref());
  document.documentElement.dataset.accent = getAccent();
});

/* ---- entry animations ---- */
function setupReveal(): void {
  const els = document.querySelectorAll('[data-reveal]:not(.is-visible)');
  if (els.length === 0) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }
  );
  els.forEach((el) => io.observe(el));
}

function init(): void {
  syncThemeUI();
  syncAccentUI();
  setupReveal();
}

init();
document.addEventListener('astro:page-load', init);