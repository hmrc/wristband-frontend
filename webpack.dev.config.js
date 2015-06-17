'use strict';

var config = require('./webpack.base.config.js');

config.devServer = {
  port: 3000,
  contentBase: 'src',
  stats: {
    colors: true
  },
  historyApiFallback: true
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

module.exports = config;
