(function() {

var callCommands = function(tasks, DEST_LANG, utterance, reference){
  reference = reference || '.+';
  var commands = [];

  if (angular.isArray(tasks)) {
    commands = tasks;
  }
  else {
    commands.push(tasks);
  }

  commands.forEach(function(command){
    if (command.lang !== DEST_LANG) {
      return false;
    }

    var regex = command.regex || null;

    if (utterance.match(regex)) {
      if (utterance.match(new RegExp(reference, 'ig'))) {
        command.call(utterance);
      }
    }
  });
};

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

adaptive.provider('$speechCorrection', function() {

  this.STORAGE_ID = 'adaptive:speech:correction';
  this.$get = function() {

    var STORAGE_ID = this.STORAGE_ID;
    var correctionMap = JSON.parse(localStorage.getItem(STORAGE_ID) || '{}');

    var save = function(STORAGE_ID, correctionMap){
      localStorage.setItem(STORAGE_ID, JSON.stringify(correctionMap));
    };

    var addUtterance = function(utterance, correction, lang){
      correctionMap[lang] = correctionMap[lang] || {};
      correctionMap[lang][utterance] = correction;
    };

    var removeUtterance = function(utterance, lang){
      delete correctionMap.lang[utterance];
    };

    var addLangMap = function(lang, map){
      correctionMap[lang] = correctionMap[lang] || {};
      correctionMap[lang] = map;
    };

    var clearLangMap = function(lang){
      delete correctionMap[lang];
    };

    var getCorrectionMap = function(){
      return correctionMap;
    };

    var getLangMap = function(lang){
      return correctionMap[lang];
    };

    var getCorrection = function(utterance, lang){
      return ((correctionMap[lang] && correctionMap[lang][utterance]) || utterance);
    };

    return {
      addUtterance: function(utterance, correction, lang){
        addUtterance(utterance, correction, lang);
        save(STORAGE_ID, correctionMap);
      },

      removeUtterance: function(utterance, lang){
        removeUtterance(utterance, lang);
        save(STORAGE_ID, correctionMap);
      },

      addLangMap: function(lang, map){
        addLangMap(lang, map);
        save(STORAGE_ID, correctionMap);
      },

      clearLangMap: function(lang){
        clearLangMap(lang);
        save(STORAGE_ID, correctionMap);
      },

      getCorrectionMap: function(){
        return getCorrectionMap();
      },

      getLangMap: function(lang){
        return getLangMap(lang);
      },

      getCorrection: function(utterance, lang){
        return getCorrection(utterance, lang);
      }
    };

  };
});

adaptive.provider('$speechSynthetis', function() {

  this.corsProxyServer = 'http://www.corsproxy.com/';

  this.$get = function() {

    var corsProxyServer = this.corsProxyServer;
    var justSpoke = false;

    /**
    * @ngdoc function
    * @name adaptive.speech.$speechSynthetis#speak
    * @methodOf apdative.speech.$speechSynthetis
    *
    * @description
    * Let's your computer speak to you. Simply pass a string with a text
    * you want your computer to say.
    *
    * @param {string} text Text
    * @param {string} lang Language
    */
    var speak = function(text, lang){
      if (!text) {
        return false;
      }

      var audioURL = [corsProxyServer, 'translate.google.com/translate_tts?ie=UTF-8&q=', text , '&tl=', lang].join('');
      var audio = new Audio();

      audio.addEventListener('play', function() {
      }, false);

      audio.addEventListener('ended', function() {
        justSpoke = true;
      }, false);

      audio.addEventListener('error', function() {
      }, false);

      audio.autoplay = true;
      audio.src = audioURL;
    };

    return {
      speak: function(text, lang){
        speak(text, lang);
      },

      justSpoke: function(){
        return justSpoke;
      },

      recognised: function(){
        justSpoke = false;
      }
    };
  };
});

/**
 * @ngdoc object
 * @name adaptive.speech.$speechRecognitionProvider
 *
 * @description
 * The `$speechRecognitionProvider` provides an interface to configure `$speechRecognition 
 * service for runtime.
 */

adaptive.provider('$speechRecognition', function() {

  this.DEST_LANG = 'en-US';
  
  this.setLang = function(lang){
    this.DEST_LANG = lang;
  };
  
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
  this.$get = ['$rootScope', '$speechSynthetis', '$speechCorrection', function($rootScope, $speechSynthetis, $speechCorrection) {

    var DEST_LANG = this.DEST_LANG;

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
        if (onerror) {
          onerror(e);
        }
      };
    };

    init();

    var payingAttention = true;
    var isListening = false;

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
      }
      isListening = true;
    };

    var stopListening = function(){
      if (isListening) {
        recognizer.stop();
      }
      isListening = false;
    };

    var command = function(utterance){
      utterance = $speechCorrection.getCorrection(utterance, DEST_LANG);
      $rootScope.$emit('adaptive.speech:utterance', {'lang': DEST_LANG, 'utterance': utterance});
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

          if ($speechSynthetis.justSpoke()) {
            $speechSynthetis.recognised();
            return false;
          }

          var utterance = result[0].transcript.trim();

          if (payingAttention) {
            command(utterance);
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
        var utterance = data.utterance;
        callCommands(tasks, DEST_LANG, utterance);
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
      * app.controller('Ctrl', function ($speechRecognition, $speechSynthetis) {
      *   $speechRecognition.onstart(function() {
      *      $speechSynthetis.speak('Yes?, How can I help you?);
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

      onUtterance: function(cb){
        var unbind = $rootScope.$on('adaptive.speech:utterance', function(e, data){
          cb(data.utterance);
        });

        $rootScope.$on('destroy', unbind);
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

      command: function(utterance){
        command(utterance);
      },

      listenUtterance: function(tasks){
        return listenUtterance(tasks);
      }
    };
  }];
});

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
adaptive.directive('speechrecognition', ['$rootScope', '$speechRecognition', function ($rootScope, $speechRecognition) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var getOptions = function() {
        return angular.extend({}, scope.$eval(attrs.speechrecognition));
      };
      var opts = getOptions();
      var unbind = $rootScope.$on('adaptive.speech:utterance', function(e, data){

        var DEST_LANG = $speechRecognition.getLang();
        var utterance = data.utterance;
        callCommands(opts.tasks, DEST_LANG, utterance, opts.reference);
      });

      element.bind('$destroy', function() {
        unbind();
      });

    }
  };
}]);

})();
