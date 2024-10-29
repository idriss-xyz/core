import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@idriss-xyz/ui'],
  },
};

// eslint-disable-next-line import/no-default-export
export default withBundleAnalyzer({ enabled: false })(nextConfig);
