var _ = require('underscore');

// Launch wristband and setup a mock test scenario ready for oncoming test case
exports.command = function(opts) {
  this
    .setMock(opts)
    .url(this.launch_url)
    .waitForElementVisible('body', 1000)

  return this; // allows the command to be chained.
};
