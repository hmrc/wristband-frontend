'use strict';

var webpack = require('webpack');

module.exports = {
  target: 'web',
  entry: './src/entry.jsx',
  output: {
    path: './dist/js',
    pathInfo: true,
    publicPath: '/js/',
    filename: 'main.js',
    css: 'style.css'
  },
  module: {
    preLoaders: [
      {test: /\.js(x)?$/, loader: 'eslint-loader', exclude: /node_modules/}
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
    })
  ]
};
