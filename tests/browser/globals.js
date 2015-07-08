var mockServer = require('mockserver-grunt');
var wristband = require('../../server.js');

module.exports = {
  mockOpts: {
    serverPort: 3002,
    proxyPort: 4002,
    debug: true
  },

  before: function(callback) {
    console.log('Setting up mockserver..');
    mockServer.start_mockserver(this.mockOpts).then(function() {
      console.log('Starting Wristband (using mockserver for API)..');
      process.env.NODE_ENV = 'test';
      wristband.start(callback);
    });
  },

  after: function(callback) {
    console.log('Tearing down mockserver..');
    mockServer.stop_mockserver()
      .then(function(){
        console.log('Mockserver torn down.');
        wristband.stop(callback);
      })
      .catch(function(error) {
        console.log("Error: ", error);
      });
  }
}
