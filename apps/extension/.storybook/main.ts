import type { StorybookConfig } from '@storybook/react-webpack5';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { DefinePlugin } from 'webpack';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-webpack5-compiler-babel',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (config) => {
    // include our own injected tailwind string
    if (config.module?.rules) {
      config.module.rules = config.module.rules.filter((rule) => {
        return (rule as any).test?.source !== /\.css$/.source;
      });

      config.module.rules.push({
        test: /tailwind\.build\.css$/i,
        type: 'asset/source',
      });
    }

    if (config.plugins) {
      config.plugins.push(new NodePolyfillPlugin());
      config.plugins.push(
        new DefinePlugin({
          'process.env': JSON.stringify({
            SENTRY_ENVIRONMENT: 'storybook',
            SENTRY_DSN: '',
            AMPLITUDE_API_KEY: '',
            ENVIRONMENT: 'storybook',
          }),
        }),
      );
    }
    if (config.resolve) {
      config.resolve.plugins = [new TsconfigPathsPlugin()];
    }
    return config;
  },
};
export default config;
