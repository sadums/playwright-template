import type { Page, Locator } from '@playwright/test';

/**
 * Retry a callback until it returns a truthy value or the timeout expires.
 *
 * Use this for conditions that Playwright's built-in auto-waiting cannot
 * handle, such as polling an external service or checking application state
 * stored outside the DOM.
 */
export async function waitUntil(
  condition: () => Promise<boolean>,
  options: { timeout?: number; interval?: number; message?: string } = {},
): Promise<void> {
  const {
    timeout = 10_000,
    interval = 500,
    message = 'Condition was not met within timeout',
  } = options;
  const deadline = Date.now() + timeout;

  while (Date.now() < deadline) {
    if (await condition()) return;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(message);
}

/**
 * Wait for a locator's text content to match a predicate.
 */
export async function waitForText(
  locator: Locator,
  predicate: (text: string) => boolean,
  options: { timeout?: number } = {},
): Promise<string> {
  const { timeout = 10_000 } = options;
  await locator.waitFor({ state: 'visible', timeout });

  let lastText = '';
  await waitUntil(
    async () => {
      lastText = (await locator.textContent()) ?? '';
      return predicate(lastText);
    },
    { timeout, message: `Text predicate not satisfied. Last text: "${lastText}"` },
  );

  return lastText;
}

/**
 * Wait for the page URL to match a pattern.
 */
export async function waitForUrl(
  page: Page,
  pattern: string | RegExp,
  options: { timeout?: number } = {},
): Promise<void> {
  const { timeout = 10_000 } = options;
  await page.waitForURL(pattern, { timeout });
}
