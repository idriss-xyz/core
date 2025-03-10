declare global {
  namespace NodeJS {
    // eslint-disable-next-line unicorn/prevent-abbreviations
    interface ProcessEnv {
      SENTRY_ENVIRONMENT: string;
      SENTRY_DSN: string;
      AMPLITUDE_API_KEY: string;
      ENVIRONMENT: string;
      E2E_TWITTER_TEST_EMAIL: string;
      E2E_TWITTER_TEST_USERNAME: string;
      E2E_TWITTER_TEST_PASSWORD: string;
    }
  }
}

export {};
