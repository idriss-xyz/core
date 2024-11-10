import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  // eslint-disable-next-line @typescript-eslint/require-await
  async redirects() {
    return [
      {
        source: '/streamers/donate',
        destination: '/creators/donate',
        permanent: true,
      },
    ];
  },
  experimental: {
    optimizePackageImports: ['@idriss-xyz/ui'],
  },
};

// eslint-disable-next-line import/no-default-export
export default withBundleAnalyzer({ enabled: false })(nextConfig);
