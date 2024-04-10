import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import * as url from 'url';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default {
  mode: 'development', // "production" | "development" | "none"
  entry: {
    'chromium/webpage-script': './src/runtime/chromium/webpage-script.ts',
    'chromium/content-script': './src/runtime/chromium/content-script.ts',
    'chromium/service-worker': './src/runtime/chromium/service-worker.ts',
    'chromium/polyfills': './src/runtime/polyfills.ts',
    'chromium/standalone': './src/popup/standalone.ts',
    'firefox/webpage-script': './src/runtime/firefox/webpage-script.ts',
    'firefox/content-script': './src/runtime/firefox/content-script.ts',
    'firefox/service-worker': './src/runtime/firefox/service-worker.ts',
    'firefox/polyfills': './src/runtime/polyfills.ts',
    'firefox/standalone': './src/popup/standalone.ts',
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

        { from: './src/runtime/firefox/manifest.json', to: 'firefox' },
        { from: './src/popup/standalone.html', to: 'firefox' },
        {
          from: './src/popup/tailwindStandalone.css',
          to: 'firefox',
        },
        { from: './src/common/img', to: 'firefox/img' },
      ],
    }),
    new NodePolyfillPlugin(),
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
    splitChunks: {
      chunks: () => false,
    },
  },
};
