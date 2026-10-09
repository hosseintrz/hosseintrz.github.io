import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const KEY_ROUTES = ['/', '/about/', '/blog/', '/blog/sample-go-patterns/', '/resume/', '/404'];

test.describe('accessibility (axe)', () => {
  for (const route of KEY_ROUTES) {
    test(`axe passes on ${route}`, async ({ page }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page }).analyze();
      const critical = results.violations.filter((v) => (v.impact ?? '') !== 'minor');
      expect(critical, JSON.stringify(critical, null, 2)).toHaveLength(0);
    });
  }
});