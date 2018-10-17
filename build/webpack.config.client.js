const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpackMerge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.config.base');

const isDev = process.env.NODE_ENV === 'development';
if (isDev) {
  module.exports = webpackMerge(webpackBaseConfig, {
    entry: {
      app: path.join(__dirname, './../', 'client/index.jsx')
    },
    output: {
      filename: '[name].[hash].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, './../', 'client/index.html'),
        favicon: path.join(__dirname, './../', 'favicon.ico')
      }),
    ],
    devServer: {
      host: 'localhost',
      port: 8080,
      contentBase: path.join(__dirname, './../', 'dist'),
      overlay: true,
      publicPath: '/public/',
      historyApiFallback: {
        index: '/public/index.html'
      },
      proxy: {
        '/api': 'http://localhost:3333'
      }
    }
  });
} else {
  module.exports = webpackMerge(webpackBaseConfig, {
    entry: {
      app: path.join(__dirname, '../client/index.jsx'),
      vendor: [
        'react',
        'react-dom',
        'react-router-dom',
        'mobx',
        'mobx-react'
      ]
    },
    output: {
      filename: '[name].[hash].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, './../', 'client/index.html'),
        favicon: path.join(__dirname, './../', 'favicon.ico')
      })
    ],
    optimization: {
      runtimeChunk: {
        name: 'manifest'
      },
      splitChunks: {
        cacheGroups: {
          default: false,
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all'
          }
        }
      },
      minimizer: [
        new UglifyJsPlugin({
          // 使用文件缓存，当js文件没有变化时候就利用缓存
          cache: true,
          // 采用多线程来压缩
          parallel: true,
          // 是否配置source map
          sourceMap: true
        }),
      ]
    }
  })
}
