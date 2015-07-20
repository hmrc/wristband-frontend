var express = require('express');
var path = require('path');
var httpProxy = require('http-proxy');
var http = require('http');
var proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  ws: true
});
var app = express();
var isProduction = process.env.NODE_ENV === 'production';
var port = process.env.PORT || 3000;
var publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath));

proxy.on('error', function(err, req, res) {});

if (!isProduction) {
  app.all('/build/*', function (req, res) {
    proxy.web(req, res, {
      target: 'http://localhost:3001'
    });
  });

  app.all('/socket.io*', function (req, res) {
    proxy.web(req, res, {
      target: 'http://localhost:3001'
    });
  });

  // Backend Flask app
  app.all('/api/*', function (req, res) {
    proxy.web(req, res, {
      target: 'http://localhost:3002'
    });
  });

  // We need to use basic HTTP service to proxy
  // websocket requests from webpack
  var server = http.createServer(app);

  server.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
  });
}

var svc = (isProduction) ? app : server;

module.exports = {
  start: function(callback) {
    // Frontend webpack dev
    var devServer = require('./webpack.dev.config.js')(function() {
      svc.listen(port, function () {
        console.log('Server running on port ' + port);
        if (typeof callback === 'function') { callback(); }
      });
    });
  },

  stop: function(callback) {
    svc.close(function() {
      console.log('Wristband stopped.');
      if (typeof callback === 'function') {
        callback();
      }
    });
  }
};
