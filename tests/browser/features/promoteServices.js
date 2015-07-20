module.exports = {
  "Promote service from qa to staging-left" : function (browser) {
    browser
      .launchWristband({ mock: [ 'promoteService' ] })
      .end();
      // .waitForElementVisible('nav', 1000)
      // .assert.elementPresent('nav')
      // .click('.ns-LinkTo--widgets')
      // .pause(200)
      // .assert.containsText('h1', 'Widgets')
  }
};
