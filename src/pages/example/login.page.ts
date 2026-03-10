import type { Page } from '@playwright/test';
import { BasePage } from '../base.page.js';

/**
 * LoginPage — reference concrete Page Object.
 *
 * Demonstrates the POM conventions used throughout this template:
 * - Locators are private readonly fields.
 * - Public methods expose actions (login) and queries (getErrorMessage).
 * - Tests import this class via the @pages alias, never touching raw locators.
 */
export class LoginPage extends BasePage {
  private readonly emailInput = this.page.getByLabel('Email');
  private readonly passwordInput = this.page.getByLabel('Password');
  private readonly submitButton = this.page.getByRole('button', { name: /sign in/i });
  private readonly errorMessage = this.page.getByRole('alert');
  private readonly forgotPasswordLink = this.page.getByRole('link', { name: /forgot password/i });

  constructor(page: Page) {
    super(page);
  }

  override async goto(): Promise<void> {
    await super.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return (await this.errorMessage.textContent()) ?? '';
  }

  async isErrorVisible(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }

  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }
}
