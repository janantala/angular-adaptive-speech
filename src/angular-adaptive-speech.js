(function () {

/**
 * @ngdoc overview
 * @name adaptive.speech
 *
 * @description
 * `adaptive.speech` is an Angular module which provides you with speech recognition
 * API's. Use its service to control your web app using speech commands. It's based
 * on Chrome's speech recognition API.
 */
var adaptive = angular.module('adaptive.speech', []);

adaptive.value('DEST_LANG', 'en-US');

/**
 * @ngdoc object
 * @name adaptive.speech.$speechRecognition
 * @requires $rootScope
 * 
 * @description
 * The `$speechRecognition` service is your interface to communicate with underlying
 * native speech recognition implementations by the browser. It provides several methods
 * to for example paying attention and listening to what the user says, or it can
 * react on specific callbacks.
 */
adaptive.factory('$speechRecognition', ['$rootScope', 'DEST_LANG', function ($rootScope, DEST_LANG) {

  var SpeechRecognitionMock = function(){
    this.start = function() { this.onerror({'code': 0, 'error': 'speech recognition is not supported'}); }.bind(this);
    this.stop = function() { this.onerror({'code': 0, 'error': 'speech recognition is not supported'}); }.bind(this);
  };

  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || SpeechRecognitionMock;

  var recognizer;

  var init = function(){
    recognizer = new window.SpeechRecognition();
    recognizer.continuous = true;
    recognizer.interimResults = true;
    recognizer.maxAlternatives = 3;

    recognizer.onresult = function(e) {
      if (onresult) {
        onresult(e);
      }
    };

    recognizer.onstart = function(e) {
      console.log('listening...');
      if (onstart) {
        onstart(e);
      }
    };

    recognizer.onend = function(e) {
      if (onend) {
        onend(e);
      }
    };

    recognizer.onerror = function(e) {
      console.log(e);
      if (onerror) {
        onerror(e);
      }
    };
  };

  init();

  var payingAttention = false;
  var isListening = false;
  var justSpoke = false;

  /**
   * @ngdoc function
   * @name adaptive.speech.$speechRecognition#start
   * @methodOf apdative.speech.$speechRecognition
   *
   * @description
   * Let's your computer speak to you. Simply pass a string with a text
   * you want your computer to say.
   *
   * @param {string} text Text
   */
  var speak = function(text){
    if (!text) {
      return false;
    }

    var audioURL = ['http://www.corsproxy.com/', 'translate.google.com/translate_tts?ie=UTF-8&q=', text , '&tl=', DEST_LANG].join('');
    var audio = new Audio();

    audio.addEventListener("play", function () {
      console.log('isSpeaking start');
    }, false);

    audio.addEventListener("ended", function () {
      justSpoke = true;
      console.log('isSpeaking end');
    }, false);

    audio.addEventListener("error", function () {
      console.log('error');
      console.log('isSpeaking end');
    }, false);

    audio.autoplay = true;
    audio.src = audioURL;


  };

  var random = function(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  };

  /**
   * @ngdoc function
   * @name adaptive.speech.$speechRecognition#listen
   * @methodOf adaptive.speech.$speechRecognition
   *
   * @description
   * Starts the speech recognizer and listens for speech input.
   */
  var listen = function(){
    if (!isListening) {
      init();
      recognizer.start();
      console.log(recognizer);
    }
    isListening = true;
  };

  var stopListening = function(){
    if (isListening) {
      recognizer.stop();
      console.log(recognizer);
    }
    isListening = false;
  };

  /**
   * @ngdoc function
   * @name adaptive.speech.$speechRecognition#setLang
   * @methodOf adaptive.speech.$speechRecognition
   *
   * @description
   * Configures speech recognizer to use given language when trying to recognize
   * speech input. Default is `en-US`.
   *
   * @
   */
  var setLang = function(lang){
    DEST_LANG = lang;
    recognizer.lang = lang;
  };

  var onstart, onerror;

  var onend = function(e){
    payingAttention = false;
    recognizer = null;
  };

  var onresult = function(e){
    if (e.results.length) {
      var result = e.results[e.resultIndex];
      if (result.isFinal) {

        if (justSpoke) {
          justSpoke = false;
          return false;
        }

        var utterance = result[0].transcript.trim();

        if (payingAttention) {
          console.log(result);
          console.log('utterance: "' + utterance + '"');
          $rootScope.$emit('adaptive.speech:utterance', {'lang': DEST_LANG, 'utterance': utterance});
        }
      }
    }
  };

  /**
   * @ngdoc function
   * @name adaptive.speech.$speechRecognition#listenUtterance
   * @methodOf adaptive.speech.$speechRecognition
   *
   * @description
   * With `$speechRecognition.listenUtterance()` you're able to setup several tasks 
   * for the speech recognizer within your controller. `listenUtterance()` expects a 
   * task description object, that holds defined tasks. A task needs an identifier, 
   * a regex for the speech recognizer, as well as the language in which the speech 
   * recognizer should interpret it.
   *
   * In addition one has to provide a function that will be called once the speech
   * recognizer recognizes the given pattern.
   *
   * <pre>
   * var app = angular.module('myApp', ['adaptive.speech']);
   *
   * app.controller('Ctrl', function ($speechRecognition) {
   *  
   *     $scope.recognition = {};
   *     $scope.recognition['en-US'] = {
   *       'addToList': {
   *           'regex': /^to do .+/gi,
   *           'lang': 'en-US',
   *           'call': function(e){
   *               $scope.addToList(e);
   *           }
   *       },
   *       'listTasks': [{
   *           'regex': /^complete .+/gi,
   *           'lang': 'en-US',
   *           'call': function(e){
   *               $scope.completeTask(e);
   *           }
   *       },{
   *           'regex': /^remove .+/gi,
   *           'lang': 'en-US',
   *           'call': function(e){
   *               $scope.removeTask(e);
   *           }
   *       }]
   *     };
   * });
   * </pre>
   *
   * @param {object} tasks Task definition object
   */
  var listenUtterance = function(tasks){
    return $rootScope.$on('adaptive.speech:utterance', function(e, data){
      var array = [];
      if (angular.isArray(tasks)) {
        array = tasks;
      }
      else {
        array.push(tasks);
      }

      array.forEach(function(command){
        console.log(data);
        console.log(command);
        if (command.lang !== DEST_LANG) {
          return false;
        }

        var regex = command.regex || null;
        var utterance = data.utterance;
        console.log(regex, utterance.match(regex));

        if (utterance.match(regex)) {
          command.call(utterance);
        }
      });
    });
  };


  return {
    /**
     * @ngdoc function
     * @name adaptive.speech.$speechRecognition#onstart
     * @method adaptive.speech.$speechRecognition
     *
     * @description
     * Exepts a function which gets executed once `$speechRecognition` service
     * starts listening to speech input.
     * 
     * <pre>
     * var app = angular.module('myApp', ['adaptive.speech']);
     *
     * app.controller('Ctrl', function ($speechRecognition) {
     *   $speechRecognition.onstart(function () {
     *      $speechrecognition.speak('Yes?, How can I help you?);
     *   });
     * });
     * </pre>
     *
     * @param {object} onstartFn Function callback
     */
    onstart: function(fn){
      onstart = fn;
    },

    onerror: function(fn){
      onerror = fn;
    },

    setLang: function(lang){
      setLang(lang);
    },

    /**
     * @ngdoc function
     * @name adaptive.speech.$speechRecognition#getLang
     * @methodOf adaptive.speech.$speechRecognition
     *
     * @description
     * Returns configured language that is used by speech recognizer.
     *
     * @return {string} lang Language key
     */
    getLang: function(){
      return DEST_LANG;
    },

    speak: function(text){
      speak(text);
    },

    payAttention: function(){
      payingAttention = true;
    },

    ignore: function(){
      payingAttention = false;
    },

    listen: function(){
      listen();
    },

    stopListening: function(){
      stopListening();
    },

    listenUtterance: function(tasks){
      return listenUtterance(tasks);
    }

  };
}]);

/**
 * @ngdoc object
 * @name adaptive.speech.directive:speechrecognition
 * @requires $rootScope
 * @restrict A
 *
 * @description
 * `adaptive.speech` provides an alternative way to define tasks, the speech 
 * recognizer should listen to, to the `$speechRecognition.listenUtterance()` method.
 * All you have to do is to apply the `speechrecognition` directive to any element
 * and declare a object literal expression just as you would when using
 * `$speechRecognition.listenUtterance()`.
 */
adaptive.directive('speechrecognition', ['$rootScope', 'DEST_LANG', function ($rootScope, DEST_LANG) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var getOptions = function () {
        return angular.extend({}, scope.$eval(attrs.speechrecognition));
      };
      var opts = getOptions();
      console.log(opts);
      var unbind = $rootScope.$on('adaptive.speech:utterance', function(e, data){

        var array = [];
        if (angular.isArray(opts.tasks)) {
          array = opts.tasks;
        }
        else {
          array.push(opts.tasks);
        }

        console.log(data);
        array.forEach(function(command){
          if (command.lang !== DEST_LANG) {
            return false;
          }

          var regex = command.regex || null;
          var utterance = data.utterance;

          if (utterance.match(regex) && utterance.match(new RegExp(opts.thing, 'ig'))) {
            console.log(regex, utterance.match(regex), utterance.match(new RegExp(opts.thing, 'ig')));
            command.call(utterance);
          }
        });
      });

      scope.$on('destroy', unbind);

    }
  };
}]);


})();
