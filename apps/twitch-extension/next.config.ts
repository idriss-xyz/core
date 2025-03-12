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
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/images/[name].[hash][ext]',
      },
    });
    return config;
  },
};

export default nextConfig;
