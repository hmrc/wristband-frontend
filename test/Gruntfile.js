module.exports = function (grunt) {

  var jsPath = function (file) {
    return '../fe/static/js/' + (file || '');
  };

  grunt.initConfig({
    jasmine: {
      test: {
        options: {
          vendor: [
            jsPath('lib/jquery.js'),
            jsPath('lib/dataTables.js'),
            'spec/lib/sinon.js',
          ],
          specs: 'spec/*.spec.js',
          helpers: 'spec/*.helper.js',
          keepRunner: true,
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfig: {
              baseUrl: jsPath()
            }
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('default', ['jasmine']);
};