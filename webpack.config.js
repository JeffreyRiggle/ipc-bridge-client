const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: './[name].js',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: [".ts", ".js", ""]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        modules: [
            "./src",
            "./node_modules"
        ]
    }
}