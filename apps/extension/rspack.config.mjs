import rspack from '@rspack/core';
import path from 'path';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import { sentryWebpackPlugin } from '@sentry/webpack-plugin';
import * as url from 'url';
import { config as loadEnvironmentVariables } from 'dotenv-safe';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const webpackModeToEnvFilePath = {
  production: path.resolve(__dirname, '.env.production'),
  development: path.resolve(__dirname, '.env.development'),
};

export default (_env, argv) => {
  loadEnvironmentVariables({
    path: webpackModeToEnvFilePath[argv.mode],
  });

  return {
    mode: argv.mode,
    entry: {
      'chromium/webpage-script': './src/runtime/chromium/webpage-script.ts',
      'chromium/content-script': './src/runtime/chromium/content-script.ts',
      'chromium/service-worker': './src/runtime/chromium/service-worker.ts',
      'firefox/webpage-script': './src/runtime/firefox/webpage-script.ts',
      'firefox/content-script': './src/runtime/firefox/content-script.ts',
      'firefox/service-worker': './src/runtime/firefox/service-worker.ts',
    },
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].js',
      publicPath: '',
      chunkFormat: false,
    },
    performance: {
      maxAssetSize: 9999999999,
      maxEntrypointSize: 9999999999,
    },
    plugins: [
      new rspack.CopyRspackPlugin({
        patterns: [
          { from: './src/runtime/chromium/manifest.json', to: 'chromium' },
          { from: './src/common/img', to: 'chromium/img' },
          { from: './src/runtime/firefox/manifest.json', to: 'firefox' },
          { from: './src/common/img', to: 'firefox/img' },
        ],
      }),
      new NodePolyfillPlugin(),
      new rspack.ProvidePlugin({
        process: 'process/browser.js',
      }),
      new rspack.DefinePlugin({
        'process.env': JSON.stringify({
          SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
          SENTRY_DSN: process.env.SENTRY_DSN,
          AMPLITUDE_API_KEY: process.env.AMPLITUDE_API_KEY,
          ENVIRONMENT: process.env.ENVIRONMENT,
        }),
      }),
      sentryWebpackPlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: process.env.SENTRY_ORGANISATION,
        project: process.env.SENTRY_PROJECT,
        telemetry: false,
        disable: process.env.SENTRY_ENVIRONMENT !== 'production',
      }),
      // new BundleAnalyzerPlugin()
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '...'],
      tsConfig: path.resolve(__dirname, './tsconfig.json'),
    },
    module: {
      rules: [
        {
          test: /\.(j|t)s$/,
          exclude: [/[\\/]node_modules[\\/]/],
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
              },
              externalHelpers: true,
              transform: {
                react: {
                  runtime: 'automatic',
                  development: argv.mode !== 'production',
                  refresh: false,
                },
              },
            },
          },
        },
        {
          test: /\.(j|t)sx$/,
          exclude: [/[\\/]node_modules[\\/]/],
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
              externalHelpers: true,
              transform: {
                react: {
                  runtime: 'automatic',
                  development: argv.mode !== 'production',
                  refresh: false,
                },
              },
            },
          },
        },
        {
          test: /tailwind\.build\.css$/i,
          type: 'asset/source',
        },
        {
          test: /\.scss$/,
          use: [
            'css-loader', // translates CSS into CommonJS
            'sass-loader', // compiles Sass to CSS, using Node Sass by default
          ],
        },
        {
          test: /\.(png|jpg|gif|svg)$/i,
          type: 'asset/inline',
        },
      ],
    },
    optimization: {
      concatenateModules: false,
      minimize: false, // minimization causes runtime errors for some reason
      runtimeChunk: false,
      splitChunks: false,
    },
  };
};
