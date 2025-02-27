import { Page } from '@playwright/test';

export const toggleWalletLookup = async (page: Page) => {
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyI');
  await page.keyboard.up('Control');
};
