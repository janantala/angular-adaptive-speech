/*global todomvc */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
todomvc.controller('TodoCtrl', function TodoCtrl($scope, $location, todoStorage, filterFilter, $speechRecognition) {
	var todos = $scope.todos = todoStorage.get();

	$scope.newTodo = '';
	$scope.remainingCount = filterFilter(todos, {completed: false}).length;
	$scope.editedTodo = null;

	if ($location.path() === '') {
		$location.path('/');
	}

	$scope.location = $location;

	$scope.$watch('location.path()', function (path) {
		$scope.statusFilter = (path === '/active') ?
			{ completed: false } : (path === '/completed') ?
			{ completed: true } : null;
	});

	$scope.$watch('remainingCount == 0', function (val) {
		$scope.allChecked = val;
	});

	$scope.addTodo = function () {
		var newTodo = $scope.newTodo.trim();
		console.log(newTodo);
		if (newTodo.length === 0) {
			return;
		}

		todos.push({
			title: newTodo,
			completed: false
		});
		todoStorage.put(todos);
		console.log(todos);
		$scope.newTodo = '';
		$scope.remainingCount++;
	};

	$scope.editTodo = function (todo) {
		$scope.editedTodo = todo;
	};

	$scope.doneEditing = function (todo) {
		$scope.editedTodo = null;
		todo.title = todo.title.trim();

		if (!todo.title) {
			$scope.removeTodo(todo);
		}

		todoStorage.put(todos);
	};

	$scope.removeTodo = function (todo) {
		$scope.remainingCount -= todo.completed ? 0 : 1;
		todos.splice(todos.indexOf(todo), 1);
		todoStorage.put(todos);
	};

	$scope.todoCompleted = function (todo) {
		if (todo.completed) {
			$scope.remainingCount--;
		} else {
			$scope.remainingCount++;
		}
		todoStorage.put(todos);
	};

	$scope.clearCompletedTodos = function () {
		$scope.todos = todos = todos.filter(function (val) {
			return !val.completed;
		});
		todoStorage.put(todos);
	};

	$scope.markAll = function (completed) {
		todos.forEach(function (todo) {
			todo.completed = completed;
		});
		$scope.remainingCount = completed ? 0 : todos.length;
		todoStorage.put(todos);
	};

	/**
	 * Need to be added for speech recognition
	 */
	
	var findTodo = function(title){
		for (var i=0; i<todos.length; i++){
			if (todos[i].title == title) {
				return todos[i];
			}
		}
		return null;
	};

	var completeTodo = function(title){
		for (var i=0; i<todos.length; i++){
			if (todos[i].title == title) {
				todos[i].completed = ! todos[i].completed;
				$scope.todoCompleted(todos[i]);
				$scope.$apply();
				return true;
			}
		}
	};

	var LANG = 'en-US';
	$speechRecognition.onstart(function(e){
		$speechRecognition.speak('Yes? How can I help you?');
	});
	$speechRecognition.onerror(function(e){
		alert('An error occurred ' + (e.msg || e.error || '');
	});
	$speechRecognition.payAttention();
	// $speechRecognition.setLang(LANG);
	$speechRecognition.listen();

	$scope.recognition = {};
	$scope.recognition['en-US'] = {
		'addToList': {
			'regex': /^do .+/gi,
			'lang': 'en-US',
			'call': function(utterance){
				var parts = utterance.split(' ');
				if (parts.length > 1) {
					$scope.newTodo = parts.slice(1).join(' ');
					$scope.addTodo();
					$scope.$apply();
				}
			}
		},
		'show-all': {
			'regex': /show.*all/gi,
			'lang': 'en-US',
			'call': function(utterance){
				$location.path('/');
				$scope.$apply();
			}
		},
		'show-active': {
			'regex': /show.*active/gi,
			'lang': 'en-US',
			'call': function(utterance){
				$location.path('/active');
				$scope.$apply();
			}
		},
		'show-completed': {
			'regex': /show.*complete/gi,
			'lang': 'en-US',
			'call': function(utterance){
				$location.path('/completed');
				$scope.$apply();
			}
		},
		'mark-all': {
			'regex': /^mark/gi,
			'lang': 'en-US',
			'call': function(utterance){
				$scope.markAll(1);
				$scope.$apply();
			}
		},
		'unmark-all': {
			'regex': /^unmark/gi,
			'lang': 'en-US',
			'call': function(utterance){
				$scope.markAll(1);
				$scope.$apply();
			}
		},
		'clear-completed': {
			'regex': /clear/gi,
			'lang': 'en-US',
			'call': function(utterance){
				$scope.clearCompletedTodos();
				$scope.$apply();
			}
		},
		'listTasks': [{
			'regex': /^complete .+/gi,
			'lang': 'en-US',
			'call': function(utterance){
				var parts = utterance.split(' ');
				if (parts.length > 1) {
					console.log(JSON.stringify(todos));
					console.log(JSON.stringify($scope.todos));
					completeTodo(parts.slice(1).join(' '));
				}
			}
		},{
			'regex': /^remove .+/gi,
			'lang': 'en-US',
			'call': function(utterance){
				var parts = utterance.split(' ');
				if (parts.length > 1) {
					var todo = findTodo(parts.slice(1).join(' '));
					console.log(todo);
					if (todo) {
						$scope.removeTodo(todo);
						$scope.$apply();
					}
				}
			}
		}]
	};

	$speechRecognition.listenUtterance($scope.recognition['en-US']['addToList']);
	$speechRecognition.listenUtterance($scope.recognition['en-US']['show-all']);
	$speechRecognition.listenUtterance($scope.recognition['en-US']['show-active']);
	$speechRecognition.listenUtterance($scope.recognition['en-US']['show-completed']);
	$speechRecognition.listenUtterance($scope.recognition['en-US']['mark-all']);
	$speechRecognition.listenUtterance($scope.recognition['en-US']['unmark-all']);
	$speechRecognition.listenUtterance($scope.recognition['en-US']['clear-completed']);

});
