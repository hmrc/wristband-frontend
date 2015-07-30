// Prime a mock endpoint
var util = require('util'),
    events = require('events'),
    _ = require('underscore'),
    robohydra = require('robohydra');

function SetMock() {
  events.EventEmitter.call(this);
}

util.inherits(SetMock, events.EventEmitter);

SetMock.prototype.command = function(opts, callback) {
  var self = this,
      globals = this.client.api.globals;

  if (typeof opts !== 'object' || !opts.hasOwnProperty('mock')) {
    throw "setMock options are incorrectly set.";
  }

  var hydraConfig = _.clone(globals.roboHydraConfig);
  hydraConfig.plugins = (Array.isArray(opts.mock))
                          ? _.union(hydraConfig.plugins, opts.mock)
                          : [ opts.mock ];

  var mockServer = robohydra.createRoboHydraServer(hydraConfig);
  globals.roboHydraInstances[this.client.sessionId] = mockServer;

  // Wrap nightwatch's end() method to tear down the mock at testcase end
  // TODO: Not working yet..
  this.client.api.end = _.wrap(this.client.api.end, function(end) {
    var mockInstance = globals.roboHydraInstances[self.client.sessionId];
    mockInstance.close(function() {
      delete mockInstance;
      console.log('Mock server torn down.');
      end();
    });
  });

  mockServer.listen(hydraConfig.port, function() {
    if (!hydraConfig.quiet) {
      console.log('Mock server setup with config: ' + JSON.stringify(hydraConfig));
    }
    self.emit('complete');
  })

  return this; // allows the command to be chained.
};

module.exports = SetMock;
