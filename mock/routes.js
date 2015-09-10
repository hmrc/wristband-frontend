var auth_header = 'fakeauth';

// data
var apps = require('./data/apps');
var stages = require('./data/stages');
var users = require('./data/users');

// modules
var utils = require('./utils');

var uuids = [];

module.exports = function (app) {
  app.all('/bad/*', function (req, res, next) {
    return res.send(502, {"details": "a non-offensive message"});
  });

  app.all('/bad_and_slow/*', function (req, res, next) {
    setInterval(function() {
      res.send(500, {"details": "a non-offensive message"});
    },5000);
  });


  app.post('/login', function (req, res) {
    if (!utils.contains(users, req.body.username)) {
      return res.send(401, {"details": "bad username message from backend"});
    }

    var id = utils.id();
    uuids.push(id);
    res.cookie('fakeauth', id);
    res.send(200, id);
  });

  // authenticate all other requests
  app.all('*', function (req, res, next) {
    if (!utils.contains(uuids, req.cookies[auth_header])) {
      return res.send(401);
    }

    // else continue
    next();
  });

  app.get('/apps', function(req, res) {
    res.json(apps.get());
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

  app.put('/apps/:app/stages/:stage/version/:version', function(req, res) {
    var app = utils.find(apps.get(), 'name', req.params.app);
    var stage = utils.find(app.stages, 'name', req.params.stage);
    var id = utils.id();

    if (!stage) {
      app.stages.push({
        'name': req.params.stage,
        'version': '...'
      });

      stage = utils.find(app.stages, 'name', req.params.stage);
    }

    stage.jobid = id;

    setTimeout(function () {
      delete stage.jobid;
      stage.version = req.params.version;
    }, 9 + (Math.random() * 21) * 1000);

    res.send(id);
  });

};
