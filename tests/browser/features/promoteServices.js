module.exports = {
  "Promote service from qa to staging-left" : function (browser) {
    browser
      .url(browser.launch_url)
      .setMock({ config: this.mockOpts, uri: '/api/config', using: '/api/config' })
      .waitForElementVisible('body', 1000)
      // .waitForElementVisible('nav', 1000)
      // .assert.elementPresent('nav')
      // .click('.ns-LinkTo--widgets')
      // .pause(200)
      // .assert.containsText('h1', 'Widgets')
  }
};
