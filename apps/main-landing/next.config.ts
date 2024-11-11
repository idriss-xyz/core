import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
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
    ];
  },
  experimental: {
    optimizePackageImports: ['@idriss-xyz/ui'],
  },
};

// eslint-disable-next-line import/no-default-export
export default withBundleAnalyzer({ enabled: false })(nextConfig);
