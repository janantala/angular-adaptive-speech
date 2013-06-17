describe('adaptive.speech', function() {

  var scope, $compile, $rootScope, $speechRecognition;

  beforeEach(module('adaptive.speech'));
  
  describe('default language', function() {
    it('should provide a deafult language', inject(function(DEST_LANG) {
      expect(DEST_LANG).toEqual('en-US');
    }));
  });

  describe('$speechRecognition service', function() {

    it('should be defined', inject(function($speechRecognition) {
      console.log($speechRecognition);
      expect( $speechRecognition ).toBeDefined();
    }));

  });

  describe('speechrecognition directive', function() {

  });
});