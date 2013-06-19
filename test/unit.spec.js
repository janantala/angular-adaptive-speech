describe('adaptive.speech', function() {

  var rootscope;

  beforeEach(module('adaptive.speech'));

  beforeEach(inject(function($rootScope) {
    rootScope = $rootScope;
    spyOn(rootScope, "$on").andCallThrough();
    spyOn(rootScope, "$broadcast").andCallThrough();
  }));

  describe('default language', function() {

    var DEST_LANG;

    beforeEach(inject(function (_DEST_LANG_) {
      DEST_LANG= _DEST_LANG_;
    }));

    it('should provide a deafult language', function() {
      expect(DEST_LANG).toEqual('en-US');
    });
  });

  describe('$speechRecognition service', function() {

    var $speechRecognition;

    beforeEach(inject(function (_$speechRecognition_) {
      $speechRecognition = _$speechRecognition_;
    }));

    it('should be an object', function () {
      expect(typeof $speechRecognition).toBe('object');
    });

    it('should have methods onstart(), onerror(), setLang(), getLang(), speak(), payAttention(), listen(), stopListening(), listenUtterance()', function () {
      expect($speechRecognition.onstart).toBeDefined();
      expect($speechRecognition.onerror).toBeDefined();
      expect($speechRecognition.setLang).toBeDefined();
      expect($speechRecognition.getLang).toBeDefined();
      expect($speechRecognition.speak).toBeDefined();
      expect($speechRecognition.payAttention).toBeDefined();
      expect($speechRecognition.listen).toBeDefined();
      expect($speechRecognition.stopListening).toBeDefined();
      expect($speechRecognition.listenUtterance).toBeDefined();

      expect(typeof $speechRecognition.onstart).toBe('function');
      expect(typeof $speechRecognition.onerror).toBe('function');
      expect(typeof $speechRecognition.setLang).toBe('function');
      expect(typeof $speechRecognition.getLang).toBe('function');
      expect(typeof $speechRecognition.speak).toBe('function');
      expect(typeof $speechRecognition.payAttention).toBe('function');
      expect(typeof $speechRecognition.listen).toBe('function');
      expect(typeof $speechRecognition.stopListening).toBe('function');
      expect(typeof $speechRecognition.listenUtterance).toBe('function');
    });

    describe('onstart(), onerror(), speak(), payAttention(), listen(), stopListening()', function() {
      it('should call functions', function() {
        spyOn($speechRecognition, "onstart").andCallThrough();
        spyOn($speechRecognition, "onerror").andCallThrough();
        spyOn($speechRecognition, "speak").andCallThrough();
        spyOn($speechRecognition, "payAttention").andCallThrough();
        spyOn($speechRecognition, "listen").andCallThrough();
        spyOn($speechRecognition, "stopListening").andCallThrough();

        $speechRecognition.onstart();
        expect($speechRecognition.onstart).toHaveBeenCalled();
        $speechRecognition.onerror();
        expect($speechRecognition.onerror).toHaveBeenCalled();
        $speechRecognition.speak();
        expect($speechRecognition.speak).toHaveBeenCalled();
        $speechRecognition.payAttention();
        expect($speechRecognition.payAttention).toHaveBeenCalled();
        $speechRecognition.listen();
        expect($speechRecognition.listen).toHaveBeenCalled();
        $speechRecognition.stopListening();
        expect($speechRecognition.stopListening).toHaveBeenCalled();
      });
    });


    describe('setLang(), getLang()', function() {
      it('should change a language', function() {
        $speechRecognition.setLang('sk-SK');
        expect($speechRecognition.getLang()).toEqual('sk-SK');
      });
    });

    describe('listenUtterance()', function() {

      it('should have called rootScope.$on', function(){
        $speechRecognition.listenUtterance();
        expect(rootScope.$on).toHaveBeenCalled();
      });

      it('should have called rootScope.$broadcast', function(){
        var mockUtterance = {'lang': 'en-US', 'utterance': 'do something'};
        rootScope.$broadcast('adaptive.speech:utterance', mockUtterance);
        expect(rootScope.$broadcast).toHaveBeenCalled();
      });

      it('should call a function after recognition - object', function() {
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

        rootScope.$broadcast('adaptive.speech:utterance', mockUtterance);
        expect(calledCount).toEqual(1);
      });

      it('should call a function after recognition - array', function() {
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

          rootScope.$broadcast('adaptive.speech:utterance', mockUtterance1);
          expect(calledCount).toEqual(1);

          rootScope.$broadcast('adaptive.speech:utterance', mockUtterance2);
          expect(calledCount).toEqual(2);
      });

    });


  });

  describe('speechrecognition directive', function() {

  });
});