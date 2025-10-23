declare global {
  namespace NodeJS {
    // eslint-disable-next-line unicorn/prevent-abbreviations
    interface ProcessEnv {
      ENVIRONMENT: string;
    }
  }
}

export {};
