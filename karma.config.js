
var webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
    config.set({
        basePath: 'src',
        frameworks: ['jasmine'],
        files: [
            '**/*Spec.js'
        ],
        preprocessors: {
            '**/*Spec.js': ['webpack']
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