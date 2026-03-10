/**
 * Single import point for all specs.
 *
 * Every spec should import { test, expect } from this file — never
 * directly from @playwright/test. This ensures all page fixtures are
 * available and the fixture chain is fully merged.
 *
 * To add a new fixture:
 *   1. Create or update a fixture file in tests/fixtures/
 *   2. Merge it here using: export const test = pageFixtures.extend<NewFixtures>({ ... })
 */
export { test, expect } from './page-fixtures.js';
