import { defineConfig, devices } from '@playwright/test';
import { config as loadEnv } from 'dotenv';

loadEnv();

const testTags = process.env['TEST_TAGS'];

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  ...(process.env['CI'] ? { workers: 4 } : {}),
  ...(testTags ? { grep: new RegExp(testTags) } : {}),
  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright'],
    ...(process.env['CI'] ? [['github'] as ['github']] : [['list'] as ['list']]),
  ],
  use: {
    baseURL: process.env['BASE_URL'],
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
