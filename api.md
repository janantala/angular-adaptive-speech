### API

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

### getLang()

### payAttention()

### ignore()

### listen()

### stopListening()

### command(utterance)

### listenUtterance(tasks)

## $speechSynthetis

### speak()

### justSpoke()

### recognised()

## $speechCorrection

### addUtterance(utterance, correction, lang)

### removeUtterance(utterance, lang)

### addLangMap(lang, map)

### clearLangMap(lang)

### getCorrectionMap()

### getLangMap(lang)

### getCorrection(utterance, lang)

## speechrecognition directive

```html
<li ng-repeat="todo in todos | filter:statusFilter track by $index" speechrecognition="{'tasks': recognition['en-US']['listTasks'], 'reference': todo}">
    {{todo}}
</li>
```
