var appNames = ['assets-frontend', 'hmrc.github.io', 'jenkins-jobs', 'releaser', 'help-frontend', 'wristband-frontend', 'wristband', 'mongo-caching', 'play-ReactiveMongo', 'reactivemongo-test', 'simple-reactivemongo', 'reactivemongo-json', 'pertax-integration', 'time', 'nginx-buildpack', 'domain', 'emailaddress', 'http-verbs', 'play-ui', 'stream-processor', 'service-manager', 'play-events', 'batch-updater', 'sbt-distributables', 'govuk-template', 'frontend-bootstrap', 'crypto', 'play-graphite', 'play-config', 'secure', 'play-filters', 'mongo-lock', 'accessibility-driver', 'hmrc-screens', 'play-authorisation', 'accessibility-developer-tools', 'attachments-client', 'captain', 'sbt-templates', 'sbt-git-stamp', 'sbt-bobby', 'play-breadcrumb', 'jenkins-job-builders', 'play-health', 'play-scheduling', 'microservice-bootstrap', 'kickstarters', 'sbt-auto-build', 'play-partials', 'http-exceptions', 'order-id-encoder', 'hmrctest', 'car-tax-calculator', 'tabular-data-validator', 'url-builder', 'a-b-test', 'worldpay-report-generator', 'bobby-open-config', 'reference-checker', 'sbt-git-versioning', 'sbt-utils', 'git-stamp', 'play-json-logger', 'sbt-bintray-publish', 'sbt-auto-code-review', 'release', 'tax-credits-service-alpha-prototype', 'website', 'hmflow', 'karma-jasmine-jquery', 'jekyll-grid', 'sbt-docker', 'slugrunner', 'open-source-guidelines', 'puppetlabs-apt', 'akka-rabbitmq', 'puppet-clamav'];

appNames.sort();

var randomNumber = function () {
  return 110 + (Math.ceil(Math.random() * 100));
};

var asVersion = function (number) {
  number = (number + '').substring(0, 3);
  return number[0] + '.' + number[1] + '.' + number[2];
};

var number;

var apps = {};

for (var i = 0, len = appNames.length; i < len; i++) {
  number = randomNumber();

  apps[appNames[i]] = {
    "name": appNames[i],
    "stages": [
      {
        "name": "qa",
        "version": asVersion(number)
      },
      {
        "name": "staging",
        "version": asVersion(number - Math.ceil(Math.random() * 10))
      }
    ]
  };
}

module.exports = apps;