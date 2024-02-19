const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
    mode: "development", // "production" | "development" | "none"
    entry: {
        "chromium/webpageScript": "./src/runtime/chromium/webpageScript.ts",
        "chromium/contentScript": "./src/runtime/chromium/contentScript.ts",
        "chromium/serviceWorker": "./src/runtime/chromium/serviceWorker.ts",
        "chromium/polyfills": "./src/runtime/polyfills.ts",
        "chromium/standalone": "./src/infrastructure/popup/standalone.ts",
        "firefox/webpageScript": "./src/runtime/firefox/webpageScript.ts",
        "firefox/contentScript": "./src/runtime/firefox/contentScript.ts",
        "firefox/serviceWorker": "./src/runtime/firefox/serviceWorker.ts",
        "firefox/polyfills": "./src/runtime/polyfills.ts",
        "firefox/standalone": "./src/infrastructure/popup/standalone.ts"
    },
    devtool: "inline-source-map",
    output: {
        path: path.resolve(__dirname, "buildResults"),
        filename: "[name].js",
        publicPath: "chrome-extension://gjkikholgenelfadphkdbimailkhkonb/",
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "./src/runtime/chromium/manifest.json", to: "chromium" },
                { from: "./src/infrastructure/popup/standalone.html", to: "chromium" },
                { from: "./src/infrastructure/popup/tailwindStandalone.css", to: "chromium" },
                { from: "./src/common/img", to: "chromium/img" },

                { from: "./src/runtime/firefox/manifest.json", to: "firefox" },
                { from: "./src/infrastructure/popup/standalone.html", to: "firefox" },
                { from: "./src/infrastructure/popup/tailwindStandalone.css", to: "firefox" },
                { from: "./src/common/img", to: "firefox/img" },
            ],
        }),
        new NodePolyfillPlugin(),
    ],
    resolve: { extensions: [".ts", "..."] },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: [/node_modules/],
                loader: "ts-loader",
            },
            {
                test: /\.scss$/,
                use: [
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader", // compiles Sass to CSS, using Node Sass by default
                ],
            },
            {
                test: /\.mpts$/,
                use: ["mpts-loader"],
            },
        ],
    },
    optimization: {
        splitChunks: {
            chunks: () => false,
        },
    },
};
