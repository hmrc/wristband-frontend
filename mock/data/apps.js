var request = require('request');

var apps = [];

request('http://localhost:8000/api/apps/', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    apps = JSON.parse(body);

    apps.sort(function (a, b) {
      var alc = a.name.toLowerCase(), blc = b.name.toLowerCase();
      return alc > blc ? 1 : alc < blc ? -1 : 0;
    });
  }
});

module.exports = {
  get: function () {
    return apps;
  }
};