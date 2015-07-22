module.exports = {
  "Promote service from qa to staging-left": function(browser) {
    var deployBtn = 'button[id="deploy-app-1"]';
    var progressBar = '.progress';

    browser
      .launchWristband({ mock: [ 'promoteService' ] })
      .click(deployBtn);

    browser
      .expect.element(deployBtn).text.to.equal('Pending').before(1000);

    browser
      .expect.element(deployBtn).text.to.equal('Deploying').before(1000);

    browser
      .expect.element(progressBar).to.have.attribute('style').which.contains('width: 25%').before(2000);

    browser
      .expect.element(progressBar).to.have.attribute('style').which.contains('width: 50%').before(2000);

    browser
      .expect.element(progressBar).to.have.attribute('style').which.contains('width: 75%').before(2000);

    browser
      .expect.element(progressBar).to.have.attribute('style').which.contains('width: 100%').before(2000);

    browser
        .expect.element(deployBtn).text.to.equal('Deploy').before(15000);

    browser.end();
  }
};
