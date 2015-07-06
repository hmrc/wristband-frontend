'use strict';

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
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

module.exports = function (callback) {

  // First we fire up Webpack an pass in the configuration we created
  var bundleStart = null;

  if( process.env.NODE_ENV === 'test' ) {
    config.devServer.noInfo = true;
  }

  var compiler = webpack(config);

  // We give notice in the terminal when it starts bundling and
  // set the time it started
  compiler.plugin('compile', function() {
    console.log('Bundling...');
    bundleStart = Date.now();
  });

  // We also give notice when it is done compiling, including the
  // time it took. Nice to have
  compiler.plugin('done', function() {
    console.log('Bundled in ' + (Date.now() - bundleStart) + 'ms!');
    callback();
  });

  var devServer = new WebpackDevServer(compiler, config.devServer);

  // We fire up the development server and give notice in the terminal
  // that we are starting the initial bundle
  devServer.listen(config.devServer.port, 'localhost', function () {
    console.log('Starting dev server...');
  });

};
