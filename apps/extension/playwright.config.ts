import path from 'node:path';

import { defineConfig } from '@playwright/test';
import { config } from 'dotenv';

// eslint-disable-next-line unicorn/prefer-module
config({ path: path.resolve(__dirname, '.env.e2e') });
// eslint-disable-next-line import/no-default-export
export default defineConfig({
  testDir: './tests/e2e',
  outputDir: 'test-results/test-output',
  reporter: [['html', { outputFolder: 'test-results/html-report' }], ['list']],
  use: {
    video: {
      mode: 'retain-on-failure',
      size: { width: 1920, height: 1080 },
    },
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],
});
