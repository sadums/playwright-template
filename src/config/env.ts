/**
 * Typed environment variable reader.
 * Throws descriptive errors for missing required variables at import time,
 * surfacing misconfiguration at startup rather than mid-test.
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
        `Copy .env.example to .env and set a value for ${name}.`,
    );
  }
  return value;
}

function optionalEnv(name: string, defaultValue?: string): string | undefined {
  return process.env[name] ?? defaultValue;
}

export const ENV = {
  BASE_URL: requireEnv('BASE_URL'),
  TEST_USER_EMAIL: requireEnv('TEST_USER_EMAIL'),
  TEST_USER_PASSWORD: requireEnv('TEST_USER_PASSWORD'),
  API_BASE_URL: optionalEnv('API_BASE_URL', process.env['BASE_URL']),
} as const;
