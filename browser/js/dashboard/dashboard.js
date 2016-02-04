app.config(function ($stateProvider) {
    $stateProvider.state('dashboard', {
        url: 'games/:gameId/character/:characterId/dashboard/',
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
  var ref = new Firebase('https://character-test.firebaseio.com');
  var decisionRef = new Firebase('https://character-test.firebaseio.com/Andrew/Decision/answered');

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
  $scope.choices = $firebaseArray(ref);
  console.log($scope.choices);

  //access to the answered key
  $scope.answered = $firebaseObject(decisionRef);
  console.log($scope.answered);

  //three way data binding so that when an answer is chosen, it changes answered to true
  $scope.answered.$bindTo($scope, "answered");

  //the function that is called when a choice is chosen, so that the corresponding reaction function can be called
  $scope.choose = function(choice) {
    console.log(choice.$value);
    if (choice.eventToTrigger) eventFactory.triggerEvent(choice.eventToTrigger)
    $scope.answered.$value = true;
    return choice.$value;
  }
});
