import path from 'node:path';
import * as url from 'node:url';

import { BRAND_GUIDELINE_LINK } from '@idriss-xyz/constants';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { config } from 'dotenv-safe';
import type { NextConfig } from 'next';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const loadEnvironmentConfig = () => {
  // Skip dotenv-safe in CI environment
  if (process.env.CI) {
    return;
  }

  const environment = process.env.ENVIRONMENT || 'production';
  const environmentFile = {
    production: '.env.production',
    development: '.env.development',
  };

  try {
    config({
      path: path.resolve(__dirname, environmentFile[environment]),
      allowEmptyValues: true,
      example: path.resolve(__dirname, '.env.example'),
    });
  } catch (error) {
    console.warn('Error loading environment config:', error);
  }
};

loadEnvironmentConfig();

const nextConfig: NextConfig = {
  generateBuildId: () => {
    return process.env.RAILWAY_GIT_COMMIT_SHA ?? `build-${Date.now()}`;
  },

  experimental: {
    optimizePackageImports: ['@idriss-xyz/ui'],
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  async redirects() {
    return [
      {
        source: '/donors/ranking',
        destination: '/creators/donor/ranking',
        permanent: true,
      },
      {
        source: '/streamers',
        destination: '/creators',
        permanent: true,
      },
      {
        source: '/streamers/donate',
        destination: '/creators/donate',
        permanent: true,
      },
      {
        source: '/token',
        destination: '/#token',
        permanent: true,
      },
      {
        source: '/buy',
        destination: '/#token',
        permanent: true,
      },
      {
        source: '/prediction-markets',
        destination: '/#community-notes',
        permanent: true,
      },
      {
        source: '/#prediction-markets',
        destination: '/#community-notes',
        permanent: true,
      },
      {
        source: '/claim',
        destination: '/vault',
        permanent: true,
      },
      {
        source: '/docs',
        destination: 'https://docs.idriss.xyz/',
        basePath: false,
        permanent: false,
      },
      {
        source: '/brand',
        destination: BRAND_GUIDELINE_LINK,
        basePath: false,
        permanent: false,
      },
      {
        source: '/discord',
        destination: 'https://www.discord.gg/RJhJKamjw5',
        basePath: false,
        permanent: false,
      },
      {
        source: '/github',
        destination: 'https://www.github.com/idriss-xyz',
        basePath: false,
        permanent: false,
      },
      {
        source: '/tiktok',
        destination: 'https://www.tiktok.com/@idriss_xyz_',
        basePath: false,
        permanent: false,
      },
      {
        source: '/instagram',
        destination: 'https://www.instagram.com/idriss_xyz',
        basePath: false,
        permanent: false,
      },
      {
        source: '/extension',
        destination:
          'https://chromewebstore.google.com/detail/idriss/fghhpjoffbgecjikiipbkpdakfmkbmig',
        basePath: false,
        permanent: false,
      },
      {
        source: '/twitch-extension',
        destination:
          'https://dashboard.twitch.tv/extensions/0rvai4arse2wu9ucj2omj2zvajdc3m-0.0.1',
        basePath: false,
        permanent: false,
      },
      {
        source: '/metamask',
        destination: 'https://snaps.metamask.io/snap/npm/idriss-crypto/snap/',
        basePath: false,
        permanent: false,
      },
      {
        source: '/snapshot',
        destination: String.raw`https://snapshot.box/#/s\:idrissxyz.eth`,
        basePath: false,
        permanent: false,
      },
      {
        source: '/governance',
        destination: 'https://docs.idriss.xyz/idriss-token/governance',
        basePath: false,
        permanent: false,
      },
      {
        source: '/pp',
        destination: 'https://docs.idriss.xyz/resources/privacy-policy',
        basePath: false,
        permanent: false,
      },
      {
        source: '/tos',
        destination: 'https://docs.idriss.xyz/resources/terms-of-service',
        basePath: false,
        permanent: false,
      },
      {
        source: '/service-status',
        destination: 'https://api.idriss.xyz/service-status',
        basePath: false,
        permanent: false,
      },
      {
        source: '/tokenomics',
        destination: 'https://docs.idriss.xyz/idriss-token',
        basePath: false,
        permanent: false,
      },
      {
        source: '/sale-faq',
        destination: 'https://docs.idriss.xyz/idriss-token/token-sale#faq',
        basePath: false,
        permanent: false,
      },
      {
        source: '/tokenomics',
        destination: 'https://docs.idriss.xyz/idriss-token/tokenomics',
        basePath: false,
        permanent: false,
      },
      {
        source: '/retroactive-distribution',
        destination:
          'https://docs.idriss.xyz/idriss-token/retroactive-distribution',
        basePath: false,
        permanent: false,
      },
      {
        source: '/creators/obs/:slug*',
        destination: '/creators/donation-overlay/:slug*',
        permanent: true,
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.mp3$/,
      type: 'asset/resource',
    });

    return config;
  },
  images: {
    domains: [
      'localhost',
      'storage.googleapis.com',
      'static-cdn.jtvnw.net',
      'images.zapper.xyz',
    ],
  },
  env: {
    DEV_LOGIN_PASSWORD: process.env.DEV_LOGIN_PASSWORD || '',
    PUBLIC_ACCESS_ENABLED: process.env.PUBLIC_ACCESS_ENABLED || '',
    RAILWAY_PUBLIC_DOMAIN: process.env.RAILWAY_PUBLIC_DOMAIN || '',
  },
};

export default withBundleAnalyzer({ enabled: false })(nextConfig);
