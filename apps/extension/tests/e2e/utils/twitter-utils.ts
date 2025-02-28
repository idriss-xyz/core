import { Page } from '@playwright/test';

export const loginOnTestAccount = async (page: Page) => {
  await page.goto('https://twitter.com/login');

  await page.waitForSelector('input[autocomplete="username"]', {
    state: 'visible',
  });

  await page.fill(
    'input[autocomplete="username"]',
    process.env.E2E_TWITTER_TEST_EMAIL,
  );

  await page.click('text=Next');

  const unusualActivityInput = page.getByTestId('ocfEnterTextTextInput');

  const isUnusualActivityVisible = await unusualActivityInput
    .isVisible()
    .catch(() => {
      return false;
    });

  if (isUnusualActivityVisible) {
    await unusualActivityInput.fill(process.env.E2E_TWITTER_TEST_USERNAME);

    await page.click('text=Next');
  }

  await page.fill(
    'input[name="password"]',
    process.env.E2E_TWITTER_TEST_PASSWORD,
  );

  await page.click('[data-testid="LoginForm_Login_Button"]');

  await page.waitForNavigation();
};
