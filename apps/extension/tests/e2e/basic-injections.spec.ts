import path from 'node:path';

import { test, expect, chromium, BrowserContext } from '@playwright/test';

import { SELECTORS, TEST_URLS } from './constants';
import { loginOnTestAccount } from './utils/twitter-utils';
import { toggleWalletLookup } from './utils/wallet-lookup-utils';

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

  test.describe('Twitter', () => {
    test('injects idriss send button on twitter profile', async () => {
      const page = await context.newPage();

      await page.goto(TEST_URLS.twitter_idriss_profile);

      const injectedElement = await page.waitForSelector(
        SELECTORS.idrissSendButton,
        {
          timeout: 5000,
        },
      );

      expect(injectedElement).toBeTruthy();
      await page.close();
    });

    test('injects idriss send button on twitter post', async () => {
      const page = await context.newPage();

      await page.goto(TEST_URLS.twitter_idriss_post);

      const injectedElement = await page.waitForSelector(
        SELECTORS.idrissSendButton,
        {
          timeout: 5000,
        },
      );

      expect(injectedElement).toBeTruthy();
      await page.close();
    });

    // Twitter login loginOnTestAccount needs to be adjusted in order to run this test
    test.skip('injects follow on farcaster button on twitter profile', async () => {
      const page = await context.newPage();

      await loginOnTestAccount(page);

      await page.goto(TEST_URLS.twitter_idriss_profile);

      const injectedElement = await page.waitForSelector(
        SELECTORS.followOnFarcasterButton,
        {
          timeout: 5000,
        },
      );

      expect(injectedElement).toBeTruthy();
      await page.close();
    });
  });

  test.describe('Warpcast', () => {
    test('injects idriss send button on warpcast profile', async () => {
      const page = await context.newPage();

      await page.goto(TEST_URLS.warpcast_idriss_profile);

      const injectedElement = await page.waitForSelector(
        SELECTORS.idrissSendButton,
        {
          timeout: 5000,
        },
      );

      expect(injectedElement).toBeTruthy();
      await page.close();
    });

    test('injects idriss send button on warpcast post', async () => {
      const page = await context.newPage();

      await page.goto(TEST_URLS.warpcast_idriss_post);

      const injectedElement = await page.waitForSelector(
        SELECTORS.idrissSendButton,
        {
          timeout: 5000,
        },
      );

      expect(injectedElement).toBeTruthy();
      await page.close();
    });
  });

  test.describe('Wallet Lookup', () => {
    test('wallet lookup displays on shortcut', async () => {
      const page = await context.newPage();

      await page.goto(TEST_URLS.twitter_idriss_profile);

      await toggleWalletLookup(page);

      const injectedElement = await page.waitForSelector(
        SELECTORS.lookupWalletAddressInput,
        {
          timeout: 5000,
        },
      );

      expect(injectedElement).toBeTruthy();

      await toggleWalletLookup(page);

      const isVisible = await injectedElement.isVisible();
      expect(isVisible).toBe(false);

      await page.close();
    });
  });

  test.afterAll(async () => {
    await context.close();
  });
});
