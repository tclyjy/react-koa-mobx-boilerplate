const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      "@views": path.join(__dirname, './../', 'client/views')
    }
  },
  output: {
    path: path.join(__dirname, './../', 'dist'),
    publicPath: '/public/',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js(x?)$/,
        loader: 'eslint-loader',
        exclude: [path.join(__dirname, './../', 'node_modules')]
      },
      {
        test: /\.js(x?)$/,
        loader: 'babel-loader',
        exclude: [path.join(__dirname, './../', 'node_modules')],
        options: {
          "presets": [
            ["es2015", {
              "loose": true
            }], "stage-1", "react"
          ],
          "plugins": ["transform-decorators-legacy", "react-hot-loader/babel"]
        }
      }]
  }
}
