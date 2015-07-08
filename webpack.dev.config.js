'use strict';

var webpack = require('webpack');
var config = require('./webpack.base.config.js');

config.devtool = '#source-map';

config.devServer = {
  port: 3001,
  contentBase: 'src',
  stats: {
    colors: true
  },
  historyApiFallback: true,
  debug: true,
  publicPath: '/build/',
  hot: true
};

config.entry = [
  'webpack-dev-server/client?http://localhost:' + config.devServer.port,
  'webpack/hot/dev-server'
].concat(config.entry);

config.module.loaders = config.module.loaders.concat([
  {
    test: /\.js(x)?$/,
    exclude: /node_modules/,
    loaders: [
      'react-hot',
      'babel',
      'flowcheck',
      'babel?blacklist=flow&optional=runtime'
    ]
  },
  {
    test: /\.css$/,
    loader: 'style!css'
  }
]);

config.plugins = config.plugins.concat(
  new webpack.HotModuleReplacementPlugin()
);

module.exports = config;
