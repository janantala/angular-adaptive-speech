describe('adaptive.speech', function() {

  describe('$speechSynthetisProvider', function() {
    var speechSynthetis;

    beforeEach(module('adaptive.speech', function($speechSynthetisProvider) {
      speechSynthetis = $speechSynthetisProvider;
    }));

    it('should be defined', inject(function() {
      expect(speechSynthetis).toBeDefined();
    }));

    it('should have corsProxyServer variable', inject(function() {
      expect(speechSynthetis.corsProxyServer).toBeDefined();
      expect(typeof speechSynthetis.corsProxyServer).toBe('string');
    }));

    it('should have corsProxyServer string to match server url', inject(function() {
      expect(speechSynthetis.corsProxyServer).toMatch(/http(s)?:\/\/.+\//);
    }));

    it('should have $get method', inject(function() {
      expect(speechSynthetis.$get).toBeDefined();
      expect(typeof speechSynthetis.$get).toBe('function');
    }));
  });


  describe('$speechSynthetis service', function() {

    beforeEach(module('adaptive.speech', function($speechSynthetisProvider) {
      // config provider
    }));

    it('should be defined', inject(function($speechSynthetis) {
      expect($speechSynthetis).toBeDefined();
    }));

    it('should have public methods', inject(function($speechSynthetis) {
      expect($speechSynthetis.speak).toBeDefined();
      expect($speechSynthetis.justSpoke).toBeDefined();
      expect($speechSynthetis.recognised).toBeDefined();

      expect(typeof $speechSynthetis.speak).toBe('function');
      expect(typeof $speechSynthetis.justSpoke).toBe('function');
      expect(typeof $speechSynthetis.recognised).toBe('function');
    }));

    it('should not to speak at the start', inject(function($speechSynthetis) {
      expect($speechSynthetis.justSpoke()).toBe(false);
    }));
  });


  describe('$speechRecognitionProvider', function() {
    var speechRecognition;

    beforeEach(module('adaptive.speech', function($speechRecognitionProvider) {
      speechRecognition = $speechRecognitionProvider;
    }));

    it('should be defined', inject(function() {
      expect(speechRecognition).toBeDefined();
    }));

    it('should have DEST_LANG variable', inject(function() {
      expect(speechRecognition.DEST_LANG).toBeDefined();
      expect(typeof speechRecognition.DEST_LANG).toBe('string');
      expect(speechRecognition.DEST_LANG).toBe('en-US');
    }));

    it('should have default value en-US', inject(function() {
      expect(speechRecognition.DEST_LANG).toBe('en-US');
    }));

    it('should have setLang method', inject(function() {
      expect(speechRecognition.setLang).toBeDefined();
      expect(typeof speechRecognition.setLang).toBe('function');
    }));

    it('should change language', inject(function() {
      speechRecognition.setLang('sk-SK');
      expect(speechRecognition.DEST_LANG).toBe('sk-SK');
    }));
    
    it('should have $get method', inject(function() {
      expect(speechRecognition.$get).toBeDefined();
      expect(typeof speechRecognition.$get).toBe('object');
    }));
  });


  describe('$speechRecognition service', function() {

    beforeEach(module('adaptive.speech', function($speechRecognitionProvider) {
      // config provider
    }));

    it('should be defined', inject(function($speechRecognition) {
      expect($speechRecognition).toBeDefined();
    }));

    it('should have public methods', inject(function($speechRecognition) {
      expect($speechRecognition.onstart).toBeDefined();
      expect($speechRecognition.onerror).toBeDefined();
      expect($speechRecognition.onUtterance).toBeDefined();
      expect($speechRecognition.setLang).toBeDefined();
      expect($speechRecognition.getLang).toBeDefined();
      expect($speechRecognition.payAttention).toBeDefined();
      expect($speechRecognition.listen).toBeDefined();
      expect($speechRecognition.stopListening).toBeDefined();
      expect($speechRecognition.command).toBeDefined();
      expect($speechRecognition.listenUtterance).toBeDefined();

      expect(typeof $speechRecognition.onstart).toBe('function');
      expect(typeof $speechRecognition.onerror).toBe('function');
      expect(typeof $speechRecognition.onUtterance).toBe('function');
      expect(typeof $speechRecognition.setLang).toBe('function');
      expect(typeof $speechRecognition.getLang).toBe('function');
      expect(typeof $speechRecognition.payAttention).toBe('function');
      expect(typeof $speechRecognition.listen).toBe('function');
      expect(typeof $speechRecognition.stopListening).toBe('function');
      expect(typeof $speechRecognition.command).toBe('function');
      expect(typeof $speechRecognition.listenUtterance).toBe('function');
    }));

    it('should call functions', inject(function($speechRecognition) {
      spyOn($speechRecognition, 'onstart').andCallThrough();
      spyOn($speechRecognition, 'onerror').andCallThrough();
      spyOn($speechRecognition, 'onUtterance').andCallThrough();
      spyOn($speechRecognition, 'payAttention').andCallThrough();
      spyOn($speechRecognition, 'listen').andCallThrough();
      spyOn($speechRecognition, 'stopListening').andCallThrough();

      $speechRecognition.onstart();
      expect($speechRecognition.onstart).toHaveBeenCalled();
      $speechRecognition.onerror();
      expect($speechRecognition.onerror).toHaveBeenCalled();
      $speechRecognition.onUtterance();
      expect($speechRecognition.onUtterance).toHaveBeenCalled();
      $speechRecognition.payAttention();
      expect($speechRecognition.payAttention).toHaveBeenCalled();
      $speechRecognition.listen();
      expect($speechRecognition.listen).toHaveBeenCalled();
      $speechRecognition.stopListening();
      expect($speechRecognition.stopListening).toHaveBeenCalled();
    }));

    it('should change a language', inject(function($speechRecognition) {
      expect($speechRecognition.getLang()).toEqual('en-US');
      $speechRecognition.setLang('sk-SK');
      expect($speechRecognition.getLang()).toEqual('sk-SK');
    }));

    it('should have called rootScope.$on', inject(function($speechRecognition, $rootScope) {
      spyOn($rootScope, '$on').andCallThrough();

      $speechRecognition.listenUtterance();
      expect($rootScope.$on).toHaveBeenCalled();
    }));

    it('should have called rootScope.$emit', inject(function($speechRecognition, $rootScope) {
      spyOn($rootScope, '$emit').andCallThrough();
      $speechRecognition.command('do something');
      expect($rootScope.$emit).toHaveBeenCalled();
    }));

    it('should call a function after recognition - object', inject(function($speechRecognition, $rootScope) {
      var calledCount = 0;
      var mockUtterance = {'lang': 'en-US', 'utterance': 'do something'};
      var mockObject = {
        'regex': /^do .+/gi,
        'lang': 'en-US',
        'call': function(utterance){
          calledCount += 1;
        }
      };

      $speechRecognition.listenUtterance(mockObject);
      expect(calledCount).toEqual(0);

      $rootScope.$emit('adaptive.speech:utterance', mockUtterance);
      expect(calledCount).toEqual(1);
    }));

    it('should call a function after recognition - array', inject(function($speechRecognition, $rootScope) {
        var calledCount = 0;
        var mockUtterance1 = {'lang': 'en-US', 'utterance': 'complete something'};
        var mockUtterance2 = {'lang': 'en-US', 'utterance': 'clear'};
        var mockArray = [{
          'regex': /^complete .+/gi,
          'lang': 'en-US',
          'call': function(utterance){
            calledCount += 1;
          }
        },{
          'regex': /clear.*/gi,
          'lang': 'en-US',
          'call': function(utterance){
            calledCount += 1;
          }
        }];

        $speechRecognition.listenUtterance(mockArray);
        expect(calledCount).toEqual(0);

        $rootScope.$emit('adaptive.speech:utterance', mockUtterance1);
        expect(calledCount).toEqual(1);

        $rootScope.$emit('adaptive.speech:utterance', mockUtterance2);
        expect(calledCount).toEqual(2);
    }));

  });

      

  // describe('speechrecognition directive - object', function() {
  //   var elm, scope, calledCount;

  //   beforeEach(inject(function($rootScope, $compile) {
  //     elm = angular.element(
  //       '<li ng-class="{completed: todo.completed, editing: todo == editedTodo}">' +
  //         '<div class="view" speechrecognition="{\'tasks\': mockObject, \'reference\': todo.title}">' +
  //           '<input class="toggle" type="checkbox" ng-model="todo.completed" ng-change="todoCompleted(todo)">' +
  //           '<label ng-dblclick="editTodo(todo)">{{todo.title}}</label>' +
  //           '<button class="destroy" ng-click="removeTodo(todo)"></button>' +
  //         '</div>' +
  //         '<form ng-submit="doneEditing(todo)">' +
  //           '<input class="edit" ng-model="todo.title" todo-blur="doneEditing(todo)" todo-focus="todo == editedTodo">' +
  //         '</form>' +
  //       '</li>'
  //     );

  //     scope = $rootScope;

  //     scope.todo = {
  //       title: 'something',
  //       completed: false
  //     };

  //     scope.mockObject = {
  //       'regex': /^complete .+/gi,
  //       'lang': 'en-US',
  //       'call': function(utterance){
  //         calledCount += 1;
  //       }
  //     };

  //     $compile(elm)(scope);
  //     scope.$digest();
  //   }));

  //   it('should have called rootScope.$on', function(){
  //     expect(rootScope.$on).toHaveBeenCalled();
  //   });

  //   it('should call a function after recognition', function() {
  //     calledCount = 0;
  //     var mockUtterance = {'lang': 'en-US', 'utterance': 'complete something'};

  //     rootScope.$broadcast('adaptive.speech:utterance', mockUtterance);
  //     expect(calledCount).toEqual(1);
  //   });

  // });


  // describe('speechrecognition directive - array', function() {
  //   var elm, scope, calledCount;

  //   beforeEach(inject(function($rootScope, $compile) {
  //     elm = angular.element(
  //       '<li ng-class="{completed: todo.completed, editing: todo == editedTodo}">' +
  //         '<div class="view" speechrecognition="{\'tasks\': mockArray, \'reference\': todo.title}">' +
  //           '<input class="toggle" type="checkbox" ng-model="todo.completed" ng-change="todoCompleted(todo)">' +
  //           '<label ng-dblclick="editTodo(todo)">{{todo.title}}</label>' +
  //           '<button class="destroy" ng-click="removeTodo(todo)"></button>' +
  //         '</div>' +
  //         '<form ng-submit="doneEditing(todo)">' +
  //           '<input class="edit" ng-model="todo.title" todo-blur="doneEditing(todo)" todo-focus="todo == editedTodo">' +
  //         '</form>' +
  //       '</li>'
  //     );

  //     scope = $rootScope;

  //     scope.todo = {
  //       title: 'something',
  //       completed: false
  //     };

  //     scope.mockArray = [{
  //       'regex': /^complete .+/gi,
  //       'lang': 'en-US',
  //       'call': function(utterance){
  //         calledCount += 1;
  //       }
  //     },{
  //       'regex': /^remove .+/gi,
  //       'lang': 'en-US',
  //       'call': function(utterance){
  //         calledCount += 1;
  //       }
  //     }];

  //     $compile(elm)(scope);
  //     scope.$digest();
  //   }));

  //   it('should have called rootScope.$on', function(){
  //     expect(rootScope.$on).toHaveBeenCalled();
  //   });

  //   it('should call a function after recognition', function() {
  //     calledCount = 0;
  //     var mockUtterance1 = {'lang': 'en-US', 'utterance': 'complete something'};
  //     var mockUtterance2 = {'lang': 'en-US', 'utterance': 'remove something'};

  //     rootScope.$broadcast('adaptive.speech:utterance', mockUtterance1);
  //     expect(calledCount).toEqual(1);

  //     rootScope.$broadcast('adaptive.speech:utterance', mockUtterance2);
  //     expect(calledCount).toEqual(2);
  //   });

  // });
});
