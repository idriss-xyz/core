import path from 'node:path';
import * as url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const BRAND_GUIDELINE_LINK = 'https://docs.idriss.xyz/resources/brand';

const loadEnvironmentConfig = async () => {
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
    const { config } = await import('dotenv-safe');
    config({
      path: path.resolve(__dirname, environmentFile[environment]),
      allowEmptyValues: true,
      example: path.resolve(__dirname, '.env.example'),
    });
  } catch (error) {
    console.warn('Error loading environment config:', error);
  }
};

// Load env config asynchronously but don't await at module level
void loadEnvironmentConfig();

const nextConfig = {
  generateBuildId: () => {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
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
        destination: '/fan/ranking',
        permanent: true,
      },
      {
        source: '/streamers',
        destination: '/',
        permanent: true,
      },
      {
        source: '/streamers/donate',
        destination: '/donate',
        permanent: true,
      },
      {
        source: '/creators/donation-overlay/:slug*',
        destination: '/alert-overlay/:slug*',
        permanent: true,
      },
      {
        source: '/creators',
        destination: '/',
        permanent: true,
      },
      {
        source: '/creators/:path+',
        destination: '/:path+',
        permanent: true,
      },
      {
        source: '/token',
        destination: '/dao#token',
        permanent: true,
      },
      {
        source: '/buy',
        destination: '/dao#token',
        permanent: true,
      },
      {
        source: '/prediction-markets',
        destination: '/',
        permanent: true,
      },
      {
        source: '/#prediction-markets',
        destination: '/',
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
        destination: 'https://www.tiktok.com/@idriss_xyz',
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
          'https://dashboard.twitch.tv/extensions/0rvai4arse2wu9ucj2omj2zvajdc3m-0.0.1 ',
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
    ];
  },
  webpack(config) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    config.module.rules.push({
      test: /\.mp3$/,
      type: 'asset/resource',
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config;
  },
  images: {
    domains: [
      'localhost',
      'storage.googleapis.com',
      'static-cdn.jtvnw.net',
      'images.zapper.xyz',
      'nftmedia.parallelnft.com',
    ],
  },
  env: {
    DEV_LOGIN_PASSWORD: process.env.DEV_LOGIN_PASSWORD || '',
    PUBLIC_ACCESS_ENABLED: process.env.PUBLIC_ACCESS_ENABLED || '',
    RAILWAY_PUBLIC_DOMAIN: process.env.RAILWAY_PUBLIC_DOMAIN || '',
  },
};

// eslint-disable-next-line import/no-default-export
export default nextConfig;
