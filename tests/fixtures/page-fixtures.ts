import { test as base } from '@playwright/test';
import { LoginPage } from '../../src/pages/index.js';

/**
 * Page fixture definitions.
 *
 * Each fixture instantiates a Page Object and passes it to the test.
 * Adding a new Page Object fixture is a one-file change with zero spec impact.
 *
 * Usage in specs:
 *   import { test, expect } from '@fixtures/index';
 *   test('example', async ({ loginPage }) => { ... });
 */
export type PageFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

export { expect } from '@playwright/test';
