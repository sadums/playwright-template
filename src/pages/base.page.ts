import type { Page, Locator } from '@playwright/test';

/**
 * BasePage provides common helpers shared by all Page Objects.
 *
 * Rules:
 * - Tests never interact with raw Playwright locators directly.
 * - All pages extend BasePage and expose named action/query methods.
 * - Locators are private readonly fields on each concrete page class.
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a path relative to BASE_URL.
   * If an absolute URL is provided it is used as-is.
   */
  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  /** Wait for a full page load (networkidle). Prefer specific element waits when possible. */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /** Get the current page title. */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /** Click a locator and wait for navigation to complete. */
  async clickAndWaitForNavigation(locator: Locator): Promise<void> {
    await Promise.all([this.page.waitForURL(/./), locator.click()]);
  }

  /** Fill a field after clearing its current value. */
  async clearAndFill(locator: Locator, value: string): Promise<void> {
    await locator.clear();
    await locator.fill(value);
  }
}
