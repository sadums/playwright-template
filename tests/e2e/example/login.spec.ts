import { test, expect } from '../../fixtures/index.js';
import { createUser } from '../../helpers/index.js';

/**
 * Reference spec for the Login feature.
 *
 * Demonstrates:
 * - Importing test + expect from the fixtures barrel (never from @playwright/test directly)
 * - Using page object fixtures (loginPage)
 * - Using Faker-based test data factories (createUser)
 * - Test tagging strategy (@smoke, @regression)
 * - Descriptive test titles that serve as living documentation
 */

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should display an error for invalid credentials @smoke @regression', async ({
    loginPage,
  }) => {
    const user = createUser({ password: 'wrong-password' });

    await loginPage.login(user.email, user.password);

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('should display an error for empty email @regression', async ({ loginPage }) => {
    await loginPage.login('', 'any-password');

    expect(await loginPage.isErrorVisible()).toBe(true);
  });

  test('should display an error for empty password @regression', async ({ loginPage }) => {
    const user = createUser();

    await loginPage.login(user.email, '');

    expect(await loginPage.isErrorVisible()).toBe(true);
  });

  test('should navigate to forgot password page @smoke', async ({ loginPage, page }) => {
    await loginPage.clickForgotPassword();

    await expect(page).toHaveURL(/forgot/i);
  });
});
