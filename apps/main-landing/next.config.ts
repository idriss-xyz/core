import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@idriss-xyz/ui'],
  },
};

// eslint-disable-next-line import/no-default-export
export default nextConfig;
