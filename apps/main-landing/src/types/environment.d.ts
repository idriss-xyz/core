declare global {
  namespace NodeJS {
    // eslint-disable-next-line unicorn/prevent-abbreviations
    interface ProcessEnv {
      DEV_LOGIN_PASSWORD: string;
      RAILWAY_PUBLIC_DOMAIN: string;
      ENVIRONMENT: 'production' | 'development';
      CI: string;
    }
  }
}

export {};
