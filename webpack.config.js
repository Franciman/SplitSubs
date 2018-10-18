const path = require('path');

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, '/src/index.tsx'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, '/dist')
    },
    devtool: 'source-map',
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            { test: /\.tsx$/,
              exclude: /node_modules/,
              loader: 'awesome-typescript-loader'
            },
            { enforce: "pre",
              test: /\.js$/,
              loader: "source-map-loader"
            }
        ]
    }

}

