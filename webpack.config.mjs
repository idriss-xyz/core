import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import webpack from 'webpack';
import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import * as url from 'url';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default (_env, argv) => {
  return {
    mode: argv.mode,
    entry: {
      'chromium/webpage-script': './src/runtime/chromium/webpage-script.ts',
      'chromium/content-script': './src/runtime/chromium/content-script.ts',
      'chromium/service-worker': './src/runtime/chromium/service-worker.ts',
      'chromium/standalone': './src/popup/standalone.ts'
    },
    devtool: 'inline-source-map',
    output: {
      path: path.resolve(__dirname, 'buildResults'),
      filename: '[name].js',
      publicPath: '',
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: './src/runtime/chromium/manifest.json', to: 'chromium' },
          { from: './src/popup/standalone.html', to: 'chromium' },
          {
            from: './src/popup/tailwindStandalone.css',
            to: 'chromium',
          },
          { from: './src/common/img', to: 'chromium/img' },
        ],
      }),
      new NodePolyfillPlugin(),
      new webpack.DefinePlugin({
        ENABLE_EVENTS: argv.mode === 'production' ? 'true' : 'false',
      }),
      // new BundleAnalyzerPlugin()
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '...'],
      plugins: [new TsconfigPathsPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader',
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
          test: /\.mpts$/,
          use: ['mpts-loader'],
        },
      ],
    },
    optimization: {
      concatenateModules: false,
      minimize: false, // minimization causes runtime errors for some reason
      splitChunks: {
        chunks: () => false,
      },
    },
  };
};
