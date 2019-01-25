const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
      app: path.resolve(__dirname, 'src/frontend/client.imba')
    },
    module: {
        rules: [
            {
                use: 'imba/loader',
                // Only run `.imba` files through Imba Loader
                test: /\.imba$/,
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