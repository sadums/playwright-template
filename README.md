# Playwright TypeScript Template

[![CI](https://github.com/your-org/playwright-template/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/playwright-template/actions/workflows/ci.yml)
![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A production-ready Playwright + TypeScript test automation template. Opinionated enough to be immediately useful; structured clearly enough to serve as a teaching reference.

This template targets QA engineers and developers starting a new Playwright project who want a solid foundation without spending a week on boilerplate. Every decision is documented so you can understand, adapt, or remove anything that doesn't fit your project.

---

## Features

- **Page Object Model** — type-safe page classes with named action and query methods; raw locators never leak into test files
- **Strict TypeScript** — `strict: true` plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and more
- **Path aliases** — `@pages/*`, `@fixtures/*`, `@helpers/*`, `@config` for clean imports across the codebase
- **Fixture merging pattern** — single import (`@fixtures/index`) gives every spec access to all Page Object fixtures
- **ESLint v9 flat config** — `typescript-eslint` + `eslint-plugin-playwright`; catches unawaited promises and Playwright anti-patterns
- **Prettier** — consistent formatting enforced in CI
- **Faker-based test data factories** — UUID-suffixed unique fields for safe parallel execution
- **dotenv** — typed `ENV` object; descriptive errors for missing required variables at startup
- **Allure + HTML reporting** — both active simultaneously; HTML report always generated
- **GitHub Actions CI** — install → typecheck → lint → format check → install browsers → run smoke tests → upload artifacts

---

## Prerequisites

- [Node.js](https://nodejs.org) >= 20 (use [nvm](https://github.com/nvm-sh/nvm) for version management)
- Git

No global installs required.

---

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/your-org/playwright-template.git
cd playwright-template

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and set BASE_URL, TEST_USER_EMAIL, TEST_USER_PASSWORD

# 4. Install Playwright browsers
npx playwright install --with-deps

# 5. Run all tests
npm test
```

---

## Project Structure

```
playwright-template/
├── .github/workflows/ci.yml        # GitHub Actions: install, lint, typecheck, test, upload report
├── src/
│   ├── config/env.ts               # Typed env var reader; throws on missing required vars
│   └── pages/
│       ├── base.page.ts            # BasePage: common helpers, goto, waitForLoad, etc.
│       ├── index.ts                # Barrel export for all page classes
│       └── example/login.page.ts  # Reference concrete Page Object
├── tests/
│   ├── e2e/example/login.spec.ts  # Reference spec: fixtures, tags, data factories, POM
│   ├── fixtures/
│   │   ├── index.ts                # Single import point for test + expect in all specs
│   │   └── page-fixtures.ts        # test.extend() calls that instantiate Page Objects
│   └── helpers/
│       ├── api-client.ts           # Thin wrapper around APIRequestContext
│       ├── index.ts                # Barrel export for all helpers
│       ├── test-data.ts            # Faker-based factory functions
│       └── wait-utils.ts           # Custom wait/retry utilities
├── .env.example                    # Committed sample env file
├── .nvmrc                          # Pins Node 20
├── eslint.config.ts                # ESLint v9 flat config
├── package.json                    # Scripts, devDependencies, engines
├── playwright.config.ts            # Projects, reporters, retries, parallelism
└── tsconfig.json                   # Strict TS config with path aliases
```

---

## Running Tests

| Command                   | Description                             |
| ------------------------- | --------------------------------------- |
| `npm test`                | Run all tests (all configured projects) |
| `npm run test:smoke`      | Run tests tagged `@smoke`               |
| `npm run test:regression` | Run tests tagged `@regression`          |
| `npm run test:headed`     | Run tests with a visible browser        |
| `npm run test:debug`      | Run tests in Playwright Inspector       |
| `npm run test:ui`         | Open Playwright UI mode                 |
| `npm run typecheck`       | TypeScript type-checking (no emit)      |
| `npm run lint`            | Run ESLint                              |
| `npm run lint:fix`        | Run ESLint with auto-fix                |
| `npm run format`          | Format all files with Prettier          |
| `npm run format:check`    | Check Prettier formatting (CI)          |
| `npm run report`          | Open the last HTML report               |
| `npm run allure:generate` | Generate Allure report from results     |
| `npm run allure:open`     | Open the generated Allure report        |

### Filtering by tag

```bash
# Run only smoke tests via env var (used in CI)
TEST_TAGS=@smoke npm test

# Run smoke tests directly (shorthand)
npm run test:smoke

# Combine tags (smoke OR regression)
TEST_TAGS="@smoke|@regression" npm test
```

---

## Configuration

`playwright.config.ts` is the central configuration file. Key settings:

| Setting         | Value                       | Notes                                                       |
| --------------- | --------------------------- | ----------------------------------------------------------- |
| `testDir`       | `./tests/e2e`               | All specs live under this directory                         |
| `fullyParallel` | `true`                      | Tests run in parallel; requires full isolation              |
| `retries`       | `2` in CI, `0` locally      | Guards against infra flakiness without hiding real failures |
| `workers`       | `4` in CI, auto locally     | Override with `--workers=N`                                 |
| `reporter`      | html + allure + github/list | Four reporters active simultaneously                        |
| `trace`         | `on-first-retry`            | Traces captured on first retry only                         |
| `screenshot`    | `only-on-failure`           | Screenshots attached to failed tests                        |

### Environment variable reference

| Variable             | Required | Description                                      |
| -------------------- | -------- | ------------------------------------------------ |
| `BASE_URL`           | Yes      | Base URL of the application under test           |
| `TEST_USER_EMAIL`    | Yes      | Email for the test user                          |
| `TEST_USER_PASSWORD` | Yes      | Password for the test user                       |
| `API_BASE_URL`       | No       | API base URL (defaults to `BASE_URL`)            |
| `TEST_TAGS`          | No       | Regex/tag filter applied to `grep`               |
| `CI`                 | No       | Set by GitHub Actions; enables stricter settings |

---

## Writing Tests

### 1. Create a Page Object

```typescript
// src/pages/example/dashboard.page.ts
import type { Page } from '@playwright/test';
import { BasePage } from '../base.page.js';

export class DashboardPage extends BasePage {
  private readonly welcomeHeading = this.page.getByRole('heading', { name: /welcome/i });
  private readonly logoutButton = this.page.getByRole('button', { name: /log out/i });

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto('/dashboard');
  }

  async getWelcomeText(): Promise<string> {
    return (await this.welcomeHeading.textContent()) ?? '';
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
```

Export it from `src/pages/index.ts`:

```typescript
export { DashboardPage } from './example/dashboard.page.js';
```

### 2. Add a fixture

```typescript
// tests/fixtures/page-fixtures.ts — add to the existing extend call
import { DashboardPage } from '../../src/pages/index.js';

export type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => { ... },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});
```

### 3. Write the spec

```typescript
// tests/e2e/example/dashboard.spec.ts
import { test, expect } from '../../fixtures/index.js';

test.describe('Dashboard', () => {
  test('should show welcome message after login @smoke', async ({ dashboardPage }) => {
    await dashboardPage.goto();
    const text = await dashboardPage.getWelcomeText();
    expect(text).toContain('Welcome');
  });
});
```

---

## Page Object Model

### Conventions

- **Locators** — private `readonly` fields using `getByRole`, `getByLabel`, `getByText` (prefer semantic selectors; avoid CSS/XPath)
- **Action methods** — return `Promise<void>`; named as verbs (`login()`, `clickSubmit()`)
- **Query methods** — return data; named as getters (`getErrorMessage()`, `isSubmitEnabled()`)
- **Never** import `Locator` or `Page` in spec files; access page state only through page object methods

### BasePage helpers

| Method                               | Description                               |
| ------------------------------------ | ----------------------------------------- |
| `goto(path)`                         | Navigate to a path relative to `BASE_URL` |
| `waitForLoad()`                      | Wait for `networkidle` state              |
| `getTitle()`                         | Return the current page `<title>`         |
| `clickAndWaitForNavigation(locator)` | Click and wait for URL change             |
| `clearAndFill(locator, value)`       | Clear a field then fill it                |

---

## Test Data

Use factory functions from `tests/helpers/test-data.ts`:

```typescript
import { createUser, createProduct } from '../../helpers/index.js';

const user = createUser(); // fully random
const admin = createUser({ email: 'admin@test.com' }); // partial override
const product = createProduct({ price: 9.99 });
```

All factories append `faker.string.uuid()` suffixes to fields that must be unique (emails, SKUs, names). This prevents collisions when tests run in parallel.

---

## CI/CD

### Triggers

- Push to `main`, `feature/**`, `fix/**`
- Pull requests targeting `main`

### Steps

1. Checkout
2. Setup Node.js (version from `.nvmrc`)
3. `npm ci` — install from lockfile
4. `npm run typecheck`
5. `npm run lint`
6. `npm run format:check`
7. Install Playwright browsers (`chromium` only in CI)
8. `npm run test:smoke`
9. Upload `playwright-report/` artifact (14-day retention)
10. Upload `test-results/` artifact (7-day retention)

### Secrets required

Set these in your GitHub repository Settings → Secrets and variables → Actions:

- `BASE_URL`
- `TEST_USER_EMAIL`
- `TEST_USER_PASSWORD`

---

## Reporting

### HTML Report (built-in)

```bash
npm test
npm run report       # opens playwright-report/index.html
```

The report is always generated (even on pass). In CI it is uploaded as a workflow artifact.

### Allure Report

```bash
npm test
npm run allure:generate   # generates allure-report/ from allure-results/
npm run allure:open       # opens allure-report/ in browser
```

Requires the `allure` CLI: `npm install -g allure-commandline`.

---

## Contributing

### Branch naming

- `feature/short-description`
- `fix/short-description`
- `chore/short-description`

### PR checklist

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes with no errors
- [ ] `npm run format:check` passes
- [ ] New tests added for new functionality
- [ ] Page objects follow the naming conventions in this README
- [ ] No `.only` in spec files
- [ ] No hardcoded credentials

---

## License

MIT — see [LICENSE](LICENSE).
