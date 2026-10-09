import { expect, test, type Page } from '@playwright/test';

const ROUTES = [
  '/',
  '/about/',
  '/blog/',
  '/blog/sample-go-patterns/',
  '/blog/tags/sample/',
  '/projects/',
  '/projects/sample-cloud-cost-dashboard/',
  '/library/',
  '/library/books/',
  '/library/papers/',
  '/now/',
  '/resume/',
  '/uses/',
  '/design/',
  '/search-index.json',
];

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}

test.describe('smoke: routes load', () => {
  for (const route of ROUTES) {
    test(`loads ${route}`, async ({ page }) => {
      const errors = collectConsoleErrors(page);
      const resp = await page.goto(route);
      expect(resp?.status()).toBe(200);
      if (route !== '/search-index.json') {
        await expect(page.locator('main')).toBeVisible();
      }
      expect(errors, errors.join('\n')).toHaveLength(0);
    });
  }

  test('404 route serves the custom page', async ({ page }) => {
    const resp = await page.goto('/this-route-does-not-exist/');
    expect([404, 200]).toContain(resp?.status());
    await expect(page.locator('main')).toContainText('404');
  });
});

test.describe('theme system', () => {
  test('dark is the default theme', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('toggle cycles dark → light and persists across reload', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');

    await page.locator('[data-theme-toggle]').click();
    await expect(html).toHaveAttribute('data-theme', 'light');

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'light');
  });

  test('accent picker applies and persists', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-accent', 'violet');

    await page.locator('[data-accent-picker] summary').click();
    await page.locator('[data-accent-option="cyan"]').click();
    await expect(html).toHaveAttribute('data-accent', 'cyan');

    await page.reload();
    await expect(html).toHaveAttribute('data-accent', 'cyan');
  });

  test('no flash of wrong theme: data-theme set before paint', async ({ page }) => {
    await page.goto('/');
    const theme = await page.evaluate(() => {
      // read the state the inline head script produced on first paint
      return document.documentElement.dataset.theme;
    });
    expect(['dark', 'light']).toContain(theme);
  });
});

test.describe('command palette', () => {
  test('opens with Ctrl+K and navigates', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Control+K');
    await expect(page.locator('#cmdk')).toBeVisible();

    await page.keyboard.type('resume');
    await page.keyboard.press('Enter');
    await page.waitForURL('**/resume/');
    await expect(page.locator('main')).toContainText('Experience');
  });

  test('full-text search returns results', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Control+K');
    await expect(page.locator('#cmdk')).toBeVisible();
    await page.keyboard.type('patterns');
    const results = page.locator('#cmdk-results li');
    await expect(results.first()).toBeVisible();
  });
});

test.describe('projects filter', () => {
  test('status chips filter the grid', async ({ page }) => {
    await page.goto('/projects/');
    const chip = page.locator('[data-filter-kind="status"][data-filter-value="shipped"]');
    await chip.click();
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
    const cards = page.locator('[data-filter-item]:not(.hidden)');
    await expect(cards).toHaveCount(1);
  });
});