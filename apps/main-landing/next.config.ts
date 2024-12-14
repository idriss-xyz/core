import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { BRAND_GUIDELINE_LINK } from '@idriss-xyz/constants';

const LEGACY_URLS = [
  '/partner-whitelist',
  '/pricing',
  '/token-price',
  '/v1/getTwitterIDPlugin',
  '/v2/getTwitterIDPlugin',
  '/v2/getTwitterNamesPlugin',
  '/v1/getTwitterID',
  '/v1/getTwitterNames',
];

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  // eslint-disable-next-line @typescript-eslint/require-await
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=1800, must-revalidate',
          },
        ],
      },
    ];
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  async redirects() {
    return [
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
        source: '/streamers/obs',
        destination: 'https://api.idriss.xyz/creators/obs',
        basePath: false,
        permanent: false,
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
        source: '/extension',
        destination:
          'https://chromewebstore.google.com/detail/idriss/fghhpjoffbgecjikiipbkpdakfmkbmig',
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
      ...LEGACY_URLS.map((url) => {
        return {
          source: url,
          destination: `https://legacy.idriss.xyz${url}`,
          permanent: false,
        };
      }),
    ];
  },
  experimental: {
    optimizePackageImports: ['@idriss-xyz/ui'],
  },
  images: {
    domains: ['localhost'],
  },
};

// eslint-disable-next-line import/no-default-export
export default withBundleAnalyzer({ enabled: false })(nextConfig);
