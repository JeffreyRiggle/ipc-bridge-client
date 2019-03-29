
var webpackConfig = require('./webpack.config.js');
webpackConfig.mode = 'development';

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'chai'],
        files: [
            '**/*.spec.ts'
        ],
        preprocessors: {
            '**/*.spec.ts': ['webpack']
        },
        webpack: {
            module: webpackConfig.module,
            resolve: webpackConfig.resolve
        },
        reporters: ['mocha'],
        port: 9876,
        color: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeHeadless'],
        singleRun: true
    });
};