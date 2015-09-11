var stages = require('./stages');

var randomFrom = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var randomNumber = function () {
  return 110 + (Math.ceil(Math.random() * 100));
};

var asVersion = function (number) {
  number = (number + '').substring(0, 3);
  return number[0] + '.' + number[1] + '.' + number[2];
};

var status = function () {
  return Math.random() > 0.95 ? 'failed' : 'success';
};

var names = ['jenkins', 'lanyard', 'database', 'play', 'micro', 'snail', 'react', 'atom', 'app', 'rpm', 'cache', 'json', 'time', 'secure', 'url', 'open'];
var suffixes = ['assets', 'jobs', 'help', 'frontend', 'updater', 'template', 'runner', 'docker', 'ui', 'release'];

var appNames = [];

for (var i = 0, len = 60; i < len; i++) {
  appNames.push(
    randomFrom(names) + '-'
    + (Math.ceil(Math.random() * 2) === 2 ? randomFrom(names) + '-' : '')
    + randomFrom(suffixes)
  );
}

appNames.sort();

var number;

var apps = [];

for (var i = 0, len = appNames.length; i < len; i++) {
  number = randomNumber();

  apps.push({
    "name": appNames[i],
    "stages": (function () {
      var arr = [];
      var random = 0;

      for (var stage in stages) {
        random = random + Math.floor(Math.random() * 3);

        arr.push({
          "name": stage,
          "version": asVersion(number - random),
          "status": status()
        });
      }

      return arr;
    }())
  });
}

module.exports = {
  get: function () {
    return apps;
  }
};
