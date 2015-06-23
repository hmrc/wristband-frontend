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
var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath));

if (!isProduction) {

  // Frontend webpack dev
  var bundle = require('./bundle.js');
  bundle();
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
  app.all('/wristband-api/*', function (req, res) {
    req.url = "";

    Object.keys(req.params).forEach(function(param) {
      req.url += '/' + req.params[param];
    });

    proxy.web(req, res, {
      target: 'http://localhost:3002'
    });
  });

  proxy.on('proxyReq', function(proxyReq, req, res, options) {
    //console.log(proxyReq, req, options);
  });

  proxy.on('error', function(e) {
    // Just catch it
  });

  // We need to use basic HTTP service to proxy
  // websocket requests from webpack
  var server = http.createServer(app);

  server.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
  });

  server.listen(port, function () {
    console.log('Server running on port ' + port);
  });

} else {

  // And run the server
  app.listen(port, function () {
    console.log('Server running on port ' + port);
  });

}


