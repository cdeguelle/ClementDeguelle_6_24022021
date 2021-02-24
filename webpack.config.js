const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

module.exports = {
    entry: {
        home: ["/assets/scss/home.scss"],
        photographer: ["/assets/scss/photographer.scss"],
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    "css-loader",
                    "postcss-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, "assets/css/"),
    },
    plugins: [
        new RemoveEmptyScriptsPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ],
}