app.config(function ($stateProvider) {
    $stateProvider.state('dashboard', {
        url: '/dashboard/:userName',
        templateUrl: 'js/dashboard/dashboard.html',
        controller: 'DashBoardController',
        resolve: {
          character: function($stateParams, characterFactory) {
            return characterFactory.getCharacter($stateParams._id);
          }
        }
    });
});

app.controller('DashBoardController', function($scope, $firebaseObject, $firebaseArray, $http, $state, character) {
  // var ref = new Firebase('https://popping-heat-9764.firebaseio.com/');
  $scope.character = character;
  var gameRef = new Firebase('https://flickering-inferno-4436.firebaseio.com/');
  var decisionRef = new Firebase('https://flickering-inferno-4436.firebaseio.com/characters/' + $scope.character._id + '/decisions');

  // Download the data into a local object
  // var syncObject = $firebaseObject(ref);
  // P.S. ^ You could also do something like this:
  // $firebaseObject(ref.child('profiles').child('physicsmarie'));

  // var syncObject = $firebaseObject(ref);


  // Synchronize the object with three-way binding
  // syncObject.$bindTo($scope, "data");
  // The database will now have a key 'text' with associated value of
  // whatever is typed into the input array in the home view.

  // syncObject.$bindTo($scope, "data");

  //before all this, we want to figure out WHICH character we want to find decisions/choices/messages for
  console.log(ref);

  //an array of all the choices
  $scope.choices = $firebaseArray(decisionRef);
  console.log($scope.choices);

  //
  $scope.currentChoice = $scope.choices[$scope.choices.length - 1];

  // //access to the answered key
  // $scope.answered = $firebaseObject(decisionRef);
  // console.log($scope.answered);
  //
  // //three way data binding so that when an answer is chosen, it changes answered to true
  // $scope.answered.$bindTo($scope, "answered");

  //the function that is called when a choice is chosen, so that the corresponding reaction function can be called
  $scope.choose = function(choice) {
    // if (choice.willTrigger) eventFactory.triggerEvent(choice.willTrigger);
    choice.eventId = $scope.currentChoice.eventId
    gameRef.child('votes').child($scope.currentChoice.eventId).push(choice)
    $scope.currentChoice.answered = true;
    // return choice.$value;
  };
});
