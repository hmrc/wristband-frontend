var wristband = require('../../server.js');

module.exports = {
  roboHydraConfig: {
    port: 3002,
    pluginLoadPaths: [ __dirname + '/robohydra/plugins' ],
    plugins: [],
    summoner: [ 'hydraPickerPlugin' ],
    quiet: true
  },

  roboHydraInstances: {},

  seleniumOpts: {
    // check for more recent versions of selenium here:
    // http://selenium-release.storage.googleapis.com/index.html
    version: '2.46.0',
    baseURL: 'http://selenium-release.storage.googleapis.com',
    drivers: {
      chrome: {
        // check for more recent versions of chrome driver here:
        // http://chromedriver.storage.googleapis.com/index.html
        version: '2.15',
        arch: process.arch,
        baseURL: 'http://chromedriver.storage.googleapis.com'
      }
    }
  },

  before: function(callback) {
    console.log('Starting Wristband..');
    process.env.NODE_ENV = 'test';
    wristband.start(callback);
  },

  after: function(callback) {
    console.log('Stopping Wristband..');
    wristband.stop(callback);
  }
}
