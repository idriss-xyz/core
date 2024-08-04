declare global {
  namespace NodeJS {
    // eslint-disable-next-line unicorn/prevent-abbreviations
    interface ProcessEnv {
      SENTRY_ENVIRONMENT: string;
      SENTRY_DSN: string;
    }
  }
}

export {};
