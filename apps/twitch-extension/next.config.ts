import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  experimental: {
    optimizePackageImports: ['@idriss-xyz/ui'],
  },
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
