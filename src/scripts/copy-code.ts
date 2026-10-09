import { svgFor } from '@/lib/icons';

const COPY_SVG = svgFor('copy', 14);
const CHECK_SVG = svgFor('check', 14);

/** Inject a copy button into every code block; re-runs after view transitions. */
function setupCopyCode(): void {
  document.querySelectorAll('.prose pre').forEach((pre) => {
    if (pre.querySelector('.code-copy')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy';
    btn.setAttribute('aria-label', 'Copy code to clipboard');
    btn.innerHTML = COPY_SVG;
    btn.addEventListener('click', async () => {
      const code = pre.querySelector<HTMLElement>('code');
      const text = code?.innerText ?? (pre as HTMLElement).innerText;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        return;
      }
      btn.innerHTML = CHECK_SVG;
      btn.classList.add('copied');
      window.setTimeout(() => {
        btn.innerHTML = COPY_SVG;
        btn.classList.remove('copied');
      }, 1600);
    });
    pre.appendChild(btn);
  });
}

setupCopyCode();
document.addEventListener('astro:page-load', setupCopyCode);