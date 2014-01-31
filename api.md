# API

## $speechRecognition

### onstart(fn)
On start event.
```js
$speechRecognition.onstart(function(e){
    // onstart
});
```

### onerror(fn)
On error event.
```js
$speechRecognition.error(function(e){
    // onerror
});
```

### onUtterance(cb)
On recognised utterance callback.
```js
$speechRecognition.onUtterance(function(utterance){
    console.log(utterance); // buy a milk
});
```

### setLang(lang)
Set recognition language.
```js
$speechRecognition.setLang('en-US');
```

To change language when recognition is already running you need to also restart recognizer:
```js
$speechRecognition.stopListening();
$speechRecognition.listen();
```

### getLang()
Get recognition language.
```js
$speechRecognition.getLang(); // 'en-US'
```
### payAttention()
Continue speech recognition after pause caused by `ignore()`. You don't need user permision again.

```js
$speechRecognition.payAttention();
```

### ignore()
Pause speech recognition.
```js
$speechRecognition.ignore();
```

### listen()
Start speech recognition. User permission is required.
```js
$speechRecognition.listen();
```

### stopListening()
Stop speech recognition.
```js
$speechRecognition.stopListening();
```

### command(utterance)
Call uterance manually.
```js
$speechRecognition.command('do something');
```

### listenUtterance(tasks)
Add listener for task
```js
var task = {
    'regex': /^do .+/gi,
    'lang': 'en-US',
    'call': function(utterance){
      // do something with utterance 'do something'
    }
};
$speechRecognition.listenUtterance(task);
```

## $speechSynthetis

### speak(text, lang)
Speak utterance.

```js
$speechSynthetis.speak('Hello there!', 'en-US');
```
### justSpoke()
Return true after `speak()` has been called.
```js
$speechSynthetis.justSpoke(); // true or false
```

### recognised()
Manualy mark speechSynthetis voice as recognised. justSpoke will be `true`.
```js
$speechSynthetis.recognised();
```

## $speechCorrection
Correct speech recognition. After incorrect recognition utterance will be corrected.

### addUtterance(utterance, correction, lang)
Create a key - value pair with incorret recognition, correction and language.
```js
$speechCorrection.addUtterance('to something', 'do something', 'en-US');
```

### removeUtterance(utterance, lang)
Remove utterance correction.
```js
$speechCorrection.removeUtterance('to something', 'en-US');
```

### addLangMap(lang, map)
Add complete correction map for a language.
```js
var map = {
    'to something': 'do something',
    'pseudo make me a sandwich': 'sudo make me a sandwich'
};
$speechCorrection.addUtterance('en-US', map);
```

### clearLangMap(lang)
Remove language map.
```js
$speechCorrection.clearLangMap('en-US');
```

### getCorrectionMap()
Get correction map for all languages.
```js
$speechCorrection.getCorrectionMap();
//  {
//      'en-US: {
//          'to something': 'do something',
//          'pseudo make me a sandwich': 'sudo make me a sandwich'
//      }
//  }
```

### getLangMap(lang)
Get correction map for a language.
```js
$speechCorrection.getCorrectionMap('en-US');
//  {
//      'to something': 'do something',
//      'pseudo make me a sandwich': 'sudo make me a sandwich'
//  }
```

### getCorrection(utterance, lang)
Get a single utterance correction.
```js
$speechCorrection.getCorrection('pseudo make me a sandwich', 'en-US'); // 'sudo make me a sandwich'
```

## speechrecognition directive
Add listener to html element.
- tasks: configuration object (*remove something*)
- reference: element reference name (*something*)

```html
<li ng-repeat="todo in todos | filter:statusFilter track by $index" speechrecognition="{'tasks': recognition['en-US']['listTasks'], 'reference': todo}">
    {{todo}}
</li>
```
