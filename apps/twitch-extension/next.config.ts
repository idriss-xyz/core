import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@idriss-xyz/main-landing'],
  output: 'export',
  distDir: 'dist',
  assetPrefix: '/',
  experimental: {
    optimizePackageImports: ['@idriss-xyz/ui'],
  },
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
};

export default nextConfig;
