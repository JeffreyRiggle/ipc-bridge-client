const path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: './[name].js',
        library: 'client',
        libraryTarget: 'umd',
    },
    resolve: {
        extensions: [".ts", ".js", ""]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            }
        ]
    }
}