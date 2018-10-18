const path = require('path');
const webpackMerge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.config.base');

module.exports = webpackMerge(webpackBaseConfig, {
  target: 'node',
  entry: {
    app: path.join(__dirname, './../', 'client/server-entry.jsx')
  },
  externals: Object.keys(require('../package.json').dependencies),
  output: {
    filename: 'server-entry.js',
    libraryTarget: 'commonjs2'
  }
})
