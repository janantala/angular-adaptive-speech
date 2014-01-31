# adaptive-speech v0.3.0 [![Build Status](https://travis-ci.org/angular-adaptive/adaptive-speech.png?branch=master)](https://travis-ci.org/angular-adaptive/adaptive-speech)

This module allows you to control web app using voice commands. It's based on Chrome's speech recognition API.

### Demo

Check out http://angular-adaptive.github.io/adaptive-speech/demo/

### References

We recomend you to read:
- [A More Awesome Web](http://moreawesomeweb.com) presentation from Google IO 2013 by Eric Bidelman
- [Voice Driven Web Apps](http://updates.html5rocks.com/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API) article from HTML5 ROCKS by Glen Shires

# Requirements

- AngularJS v ~1.2.x

# Usage

We use [bower](http://twitter.github.com/bower/) for dependency management. Add

```json
dependencies: {
    "angular-adaptive-speech": "latest"
}
```

To your `bower.json` file. Then run

    bower install

This will copy the speech recognition files into your `bower_components` folder, along with its dependencies. Load the script files in your application:

```html
<script type="text/javascript" src="bower_components/angular/angular.js"></script>
<script type="text/javascript" src="bower_components/angular-adaptive-speech/angular-adaptive-speech.min.js"></script>
```

Add the adaptive.speech module as a dependency to your application module:

```js
var myAppModule = angular.module('MyApp', ['adaptive.speech']);
```

and include $speechRecognition, $speechSynthetis, $speechCorrection service as a dependency to your controller:

```js
angular.module('MyApp').controller('MainCtrl', function ['$scope', '$speechRecognition, $speechSynthetis', ($scope, $speechRecognition, $speechSynthetis) {

}]);
```

To start speech recognition run from controller:

```js
$speechRecognition.onstart(function(){
  $speechSynthetis.speak('Yes? How can I help you?', 'en-UK');
});
$speechRecognition.setLang('en-UK'); // Default value is en-US
$speechRecognition.listen();
```

Apply the directive to your elements where *reference* is keyword reference:

```html
<ul>
    <li ng-repeat="todo in todos | filter:statusFilter track by $index" speechrecognition="{'tasks': recognition['en-US']['listTasks'], 'reference': todo}">
        {{todo}}
    </li>
</ul>
```
Or run recognition directly from controller:

```js
$speechRecognition.listenUtterance($scope.recognition['en-US']['addToList']);
```

## Options

All the speechRecognition options can be set up in your controller.

```js
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
```

# APIs

Check out [API docs](api.md).

# Testing

We use karma and jshint to ensure the quality of the code. The easiest way to run these checks is to use grunt:

    npm install -g grunt-cli
    npm install
    bower install
    grunt

The karma task will try to open Chrome as a browser in which to run the tests. Make sure this is available or change the configuration in `test/test.config.js` 

# Contributing

Pull requests are welcome. 

Make a PR against canary branch and don't bump any versions. 

Please respect the code style in place.

# License

The MIT License

Copyright (c) 2014 [Jan Antala](http://www.janantala.com)
