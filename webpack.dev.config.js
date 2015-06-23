'use strict';

var webpack = require('webpack');
var config = require('./webpack.base.config.js');

config.entry = [
  'webpack-dev-server/client?http://localhost:3001',
  'webpack/hot/dev-server'
].concat(config.entry);

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

config.module.loaders = config.module.loaders.concat([
  {test: /\.js(x)?$/, loaders: [
    'react-hot',
    'babel',
    'flowcheck',
    'babel?blacklist=flow&optional=runtime'],
    exclude: /node_modules/},
  {test: /\.css$/, loader: 'style!css'}
]);

config.plugins = config.plugins.concat(
  new webpack.HotModuleReplacementPlugin()
);

module.exports = config;
