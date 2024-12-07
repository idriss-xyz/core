declare global {
  namespace NodeJS {
    // eslint-disable-next-line unicorn/prevent-abbreviations
    interface ProcessEnv {
      SENTRY_ENVIRONMENT: string;
      SENTRY_DSN: string;
      AMPLITUDE_API_KEY: string;
      ENVIRONMENT: string;
    }
  }
}

export {};
