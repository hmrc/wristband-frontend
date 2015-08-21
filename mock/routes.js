var auth_header = 'fakeauth';

// data
var apps = require('./data/apps');
var stages = require('./data/stages');

// modules
var uuids = require('./uuids');
var utils = require('./utils');

module.exports = function (app) {

  app.all('/login', function (req, res) {
    var id = uuids.new();
    uuids.push(id);
    res.send(200, id + '');
  });

  // authenticate all other requests
  app.all('*', function (req, res, next) {
    if (!uuids.contains(req.headers[auth_header])) {
      return res.send(401);
    }

    // else continue
    next();
  });

  app.get('/apps', function(req, res) {
    res.json(utils.asArray(apps));
  });

  app.get('/apps/:name', function(req, res) {
    res.json(apps[req.params.name]);
  });

  app.get('/stages/', function(req, res) {
    res.json(utils.asArray(stages));
  });

  app.get('/stages/:name', function(req, res) {
    res.json(stages[req.params.name]);
  });

};