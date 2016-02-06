app.config(function($stateProvider) {
  $stateProvider.state('dashboard', {
    url: '/games/:gameId/character/:characterId/dashboard',
    templateUrl: 'js/dashboard/dashboard.html',
    controller: 'DashBoardController',
    resolve: {
      game: function($stateParams, GameFactory) {
        return GameFactory.getOneGame($stateParams.gameId);
      },
      character: function($stateParams, characterFactory) {
        return characterFactory.getCharacter($stateParams.gameId, $stateParams.characterId);
      }
    }
  });
});

app.controller('DashBoardController', function($scope, $firebaseObject, $firebaseArray, $http, $state, character, $rootScope, game) {
  // console.log("game", game);
  $rootScope.inGame = true;
  $scope.gameTitle = game.title;

  $scope.character = character;

  var gameRef = new Firebase('https://character-test.firebaseio.com/');
  var myCharacterRef = new Firebase('https://character-test.firebaseio.com/games/' + game.$id + '/characters/' + $scope.character.$id);
  var myMessageRef = new Firebase('https://character-test.firebaseio.com/games/' + game.$id + '/characters/' + $scope.character.$id + '/message');
  var myDecisionRef = new Firebase('https://character-test.firebaseio.com/games/' + game.$id + '/characters/' + $scope.character.$id + '/decisions');

  var myCharacterObj = $firebaseObject(myCharacterRef);
  var myMessagesObj = $firebaseObject(myMessageRef);
  var myDecisionObj = $firebaseObject(myDecisionRef);

  $scope.messages = [];
  $scope.decisions = [];

  myMessageRef.on('child_added', function(childSnapshot) {
    $scope.messages.push(childSnapshot.val().message);
  });

  myDecisionRef.on('child_added', function(childSnapshot) {
    $scope.decisions.push(childSnapshot.val());
  });

  // This might happen if a particular decision gets answered set to 'true'.
  myDecisionRef.on('child_changed', function(childSnapshot) {
    console.log("Decision changed!");
    console.log(childSnapshot.val());
    // $scope.decisions.
  });

  // if (myDecisionRef.on) {
  //   myDecisionRef.on('child_added', function(childSnapshot) {
  //     var decisionObj = {
  //       message: childSnapshot.val().message || null,
  //       question: childSnapshot.val().decision.question,
  //       choices: childSnapshot.val().decision.choices,
  //       template: 'decision'
  //     };
  //     console.log("New decision added!");
  //     Notification.decision(decisionObj);
  //   });
  // }

  // var messageWatch = myMessagesObj.$watch(function() {
  //   // console.log("The new message is…");
  //   // var newMessage = myMessagesObj[myMessagesObj.length - 1];
  //   console.log(myMessagesObj);
  // });


  //before all this, we want to figure out WHICH character we want to find decisions/choices/messages for
  // console.log(ref);

  //an array of all the choices
  // $scope.choices = $firebaseArray(decisionRef);
  // console.log($scope.choices);

  // $scope.currentChoice = $scope.choices[$scope.choices.length - 1];


  // //the function that is called when a choice is chosen, so that the corresponding reaction function can be called
  // $scope.choose = function(choice) {
  //   if (choice.willTrigger) eventFactory.triggerEvent(choice.willTrigger);
  //   choice.eventId = $scope.currentChoice.eventId
  //   gameRef.child('votes').child($scope.currentChoice.eventId).push(choice)
  //   $scope.currentChoice.answered = true;
  //   return choice.$value;
  // };
});
