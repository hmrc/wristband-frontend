'use strict';

var webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var vendorPath = path.resolve(__dirname, 'src', 'vendor');
var buildPath = path.resolve(__dirname, 'dist', 'js');
var mainPath = path.resolve(__dirname, 'src', 'entry.jsx');

module.exports = {
  target: 'web',
  entry: [ mainPath ],
  output: {
    path: buildPath,
    pathInfo: true,
    publicPath: '/build/',
    filename: 'main.js',
    css: 'style.css'
  },
  module: {
    preLoaders: [
      {test: /\.js(x)?$/, loader: 'eslint-loader', exclude: [nodeModulesPath, vendorPath]}
    ],
    loaders: [
      {test: /\.png$/, loader: 'url?mimetype=image/png'},
      {test: /\.gif$/, loader: 'url?mimetype=image/gif'},
      {test: /\.jpe?g$/, loader: 'url?mimetype=image/jpeg'},
      {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url?limit=10000&minetype=application/font-woff'},
      {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file'}
    ],
    noParse: /\.min\.js/
  },
  resolve: {
    extentions: ['js', 'jsx', 'css']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ]
};
