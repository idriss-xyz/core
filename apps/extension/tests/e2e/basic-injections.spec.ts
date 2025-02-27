import path from 'node:path';

import { test, expect, chromium, BrowserContext } from '@playwright/test';

import { TEST_IDS, TEST_URLS } from './constants';

test.describe('Basic Injections Test', () => {
  let context: BrowserContext;

  test.beforeAll(async () => {
    // eslint-disable-next-line unicorn/prefer-module
    const extensionPath = path.join(__dirname, '../../build/chromium');

    // Launch Chromium with the extension loaded.
    // Use a persistent context since extensions need a userDataDir.
    context = await chromium.launchPersistentContext('', {
      headless: false, // Extensions are not supported in headless mode
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    });
  });

  test('injects idriss send button on twitter profile', async () => {
    const page = await context.newPage();

    await page.goto(TEST_URLS.twitter_idriss_profile);

    const injectedElement = await page.waitForSelector(
      `[data-testid=${TEST_IDS.sendButton}]`,
      { timeout: 5000 },
    );

    expect(injectedElement).toBeTruthy();
  });

  test.afterAll(async () => {
    await context.close();
  });
});
