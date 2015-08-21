
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/apps/', function(req, res) {
  res.json([
      {
          "name": "test",
          "stage": {
              "qa": {
                  "version": "0.0.2",
              },
              "staging": {
                  "version": "0.0.1",
              }
          }
      }
  ]);
});

app.get('/apps/:name', function(req, res) {
  res.json({
      "name": "test",
      "stage": {
          "qa": {
              "version": "0.0.2",
          },
          "staging": {
              "version": "0.0.1",
          }
      }
  });
});

app.get('/stages/', function(req, res) {
  res.json([
      {
          "name": "qa"
      },
      {
        "name": "staging"
      }
  ]);
});

app.get('/stages/:name/apps', function(req, res) {
  res.json([
      {
          "name": "test",
          "version": "0.0.2"
      }
  ]);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
