declare global {
  namespace NodeJS {
    // eslint-disable-next-line unicorn/prevent-abbreviations
    interface ProcessEnv {
      DEV_LOGIN_PASSWORD: string;
      PUBLIC_ACCESS_ENABLED: string;
      RAILWAY_PUBLIC_DOMAIN: string;
      ZAPPER_API_KEY: string;
      ENVIRONMENT: 'production' | 'development';
      CI: string;
    }
  }
}

export {};
