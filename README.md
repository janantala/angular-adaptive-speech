# adaptive-speech [![Build Status](https://travis-ci.org/angular-adaptive/adaptive-speech.png)](https://travis-ci.org/angular-adaptive/adaptive-speech)

This module allows you to control web app using speech commands. It's based on Chrome's speech recognition API.

Module is still under development, but you can try it today.

#### References

We recomend you to read:
- [A More Awesome Web](http://moreawesomeweb.com) presentation from Google IO 2013 by Eric Bidelman
- [Voice Driven Web Apps](http://updates.html5rocks.com/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API) article from HTML5 ROCKS by Glen Shires

# Requirements

- AngularJS v 1.0+

# Usage

We use [bower](http://twitter.github.com/bower/) for dependency management. Add

    dependencies: {
        "angular-adaptive-speech": "latest"
    }

To your `bower.json` file. Then run

    bower install

This will copy the speech recognition files into your `components` folder, along with its dependencies. Load the script files in your application:

    <script type="text/javascript" src="components/angular/angular.js"></script>
    <script type="text/javascript" src="components/angular-adaptive-speech/src/adaptive-speech.js"></script>

Add the adaptive.speech module as a dependency to your application module:

    var myAppModule = angular.module('MyApp', ['adaptive.speech']);

and include $speechRecognition service as a dependency to your controller:

    angular.module('MyApp').controller('MainCtrl', function ['$scope', '$speechRecognition', ($scope, $speechRecognition) {

    }]);

To start speech recognition run from controller:

    var LANG = 'en-US';
    $speechRecognition.onstart(function(){
      $speechRecognition.speak('Yes? How can I help you?');
    });
    $speechRecognition.payAttention();
    $speechRecognition.setLang(LANG);
    $speechRecognition.listen();

Apply the directive to your elements:

    <ul>
      <li speechrecognition="{'tasks': recognition['en-US']['listTasks'], 'thing': thing}>{{thing}}</li>
    </ul>

Or run recognition directly from controller:

    $speechRecognition.listenUtterance($scope.recognition['en-US']['addToList']);

## Options

All the speechRecognition options can be set up in your controller.

    myAppModule.controller('MyController', function($scope) {
        $scope.recognition = {};
        $scope.recognition['en-US'] = {
            'addToList': {
                'regex': /^to do .+/gi,
                'lang': 'en-US',
                'call': function(e){
                    $scope.addToList(e);
                }
            },
            'listTasks': [{
                'regex': /^complete .+/gi,
                'lang': 'en-US',
                'call': function(e){
                    $scope.completeTask(e);
                }
            },{
                'regex': /^remove .+/gi,
                'lang': 'en-US',
                'call': function(e){
                    $scope.removeTask(e);
                }
            }]
        };
    });

# Testing

More tests will be added...

We use karma and jshint to ensure the quality of the code. The easiest way to run these checks is to use grunt:

  npm install -g grunt-cli
  npm install
  bower install
  grunt

The karma task will try to open Chrome as a browser in which to run the tests. Make sure this is available or change the configuration in `test/test.config.js` 

# License

The MIT License

Copyright (c) 2013 Jan Antala, https://github.com/janantala