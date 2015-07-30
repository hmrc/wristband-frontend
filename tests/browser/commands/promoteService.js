// Launch wristband and setup a mock test scenario ready for oncoming test case
exports.command = function(app) {
  this
    .click('button[id="deploy-' + app + '"]');

  return this; // allows the command to be chained.
};
