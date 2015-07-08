// Prime a mock endpoint
var util = require('util');
var mockClient = require('mockserver-client')

var mockApiPath = __dirname + '/../mocks';
var mockHost = 'localhost';
var mockApiBaseUri = '/api';

exports.command = function(mockOpts, callback) {
  var self = this,
      fs = require('fs');

  if (typeof mockOpts !== 'object') {
    throw "Mock options passed as '" + mockOpts + "'. Must be an object containing 'uri' and 'using' props.";
  }

  if (!mockOpts.hasOwnProperty('uri') || !mockOpts.hasOwnProperty('using')) {
    throw "Mock options must contain 'uri' and 'using' props. You had: " + util.inspect(mockOpts);
  }

  mockOpts.statusCode = mockOpts.statusCode || 200;

  try {
    var mockFile = mockApiPath + mockOpts.using;
    mockOpts.mockData = fs.readFileSync(mockFile);
  } catch (err) {
    console.log(err);
    throw "Unable to open mock content file: " + mockFile;
  }

  this.execute(
    function(mockOpts) {
      mockClient(mockHost, mockOpts.config.serverPort)
        .mockSimpleResponse(mockOpts.uri, mockOpts.mockData, mockOpts.statusCode);
      return true;
    },

    [mockOpts], // arguments array to be passed

    function(result) {
      if (typeof callback === "function") {
        callback.call(self, result);
      }
    }
  );

  return this; // allows the command to be chained.
};
