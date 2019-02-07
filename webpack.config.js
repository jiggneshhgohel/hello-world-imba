const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: 'development',
    entry: {
      app: path.resolve(__dirname, 'src/frontend/client.imba')
    },
    plugins: [
      new MiniCssExtractPlugin()
    ],
    module: {
        rules: [
            {
                // Only run `.imba` files through Imba Loader
                test: /\.imba$/,
                use: 'imba/loader',
            },
            {
                test:/\.css$/,
                use: [
                  MiniCssExtractPlugin.loader,
                  "css-loader"
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.imba', '.js', '.json']
    },
    output: {
        filename: "client.js",
        path: path.resolve(__dirname, 'dist')
    }
}