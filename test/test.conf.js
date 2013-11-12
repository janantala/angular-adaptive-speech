module.exports = function(config) {
  config.set({
    basePath: '..',
    files: [
      'components/angular/angular.js',
      'components/angular-mocks/angular-mocks.js',
      'src/angular-adaptive-speech.js',
      'test/*.spec.js'
    ],
    frameworks: ['jasmine'],
    singleRun: true,
    browsers: [ 'Chrome' ]
  });
};