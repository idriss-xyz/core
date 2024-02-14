const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
    mode: "development", // "production" | "development" | "none"
    entry: {
        "chromium/widgets": "./src/chromium/widgets.ts",
        "chromium/contentScript": "./src/chromium/contentScript/index.ts",
        "chromium/serviceWorker": "./src/chromium/serviceWorker.ts",
        "chromium/standalone": "./src/common/standalone.js",
        "firefox/widgets": "./src/firefox/widgets.ts",
        "firefox/contentScript": "./src/firefox/contentScript/index.ts",
        "firefox/serviceWorker": "./src/firefox/serviceWorker.ts",
        "firefox/standalone": "./src/common/standalone.js",
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
                { from: "./src/chromium/manifest.json", to: "chromium" },
                { from: "./src/common/standalone.html", to: "chromium" },
                { from: "./src/common/standalone.css", to: "chromium" },
                { from: "./src/common/img", to: "chromium/img" },

                { from: "./src/firefox/manifest.json", to: "firefox" },
                { from: "./src/common/standalone.html", to: "firefox" },
                { from: "./src/common/standalone.css", to: "firefox" },
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
