var _ = require('underscore');

// Launch wristband and setup a mock test scenario ready for oncoming test case
exports.command = function(opts) {
  this
    .click('FixedDataTableCell cellDataKey="deployButton" rowIndex="9"')

  return this; // allows the command to be chained.
};
