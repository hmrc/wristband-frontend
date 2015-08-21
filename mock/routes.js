var apps = {
  "test": {
    "name": "test",
    "stage": {
      "qa": {
        "version": "0.0.2",
      },
      "staging": {
        "version": "0.0.1"
      }
    }
  }
};

var stages = {
  "qa": {
      "name": "qa"
  },
  "staging": {
    "name": "staging"
  }
};

function asArray(obj) {
  return Object.keys(obj).map(function(k) { return obj[k] });
}

var uuids = {
  ids: [],
  push: function (id) {
    this.ids.push(id);
  },
  contains: function (id) {
    var i = this.ids.length;
    while (i--) {
        if (this.ids[i] === id) {
            return true;
        }
    }
    return false;
  }
};

function uuid() {
  return Math.ceil(Math.random() * 1000000) + '';
}

function auth(req) {
  return uuids.contains(req.headers.fakeauth);
}

module.exports = function (app) {
  app.get('/login', function (req, res) {
    res.send('<form method="post"><button>Login</button></form>');
  });

  app.post('/login', function (req, res) {
    var id = uuid();
    uuids.push(id);
    res.send(200, id + '');
  });

  app.get('/apps', function(req, res) {
    if (!auth(req)) {
      return res.send(401);
    }

    res.json(asArray(apps));
  });

  app.get('/apps/:name', function(req, res) {
    res.json(apps[req.query.name]);
  });

  app.get('/stages/', function(req, res) {
    res.json(asArray(stages));
  });

  app.get('/stages/:name/apps', function(req, res) {
    res.json([
        {
            "name": "test",
            "version": "0.0.2"
        }
    ]);
  });
};