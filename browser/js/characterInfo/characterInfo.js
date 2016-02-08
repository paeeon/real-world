app.config(function($stateProvider) {
  $stateProvider.state('characterInfo', {
    url: '/games/:gameId/character/:characterId/info',
    templateUrl: 'js/characterInfo/characterInfo.html',
    controller: 'CharacterInfoController',
    resolve: {
      character: function($stateParams, characterFactory) {
        return characterFactory.getCharacter($stateParams.gameId, $stateParams.characterId);
      },
      characters: function($stateParams, characterFactory) {
        return characterFactory.allCharacters($stateParams.gameId);
      },
      shortId: function($stateParams, GameFactory) {
        return GameFactory.getShortId($stateParams.gameId);
      }
    }
  });
});

app.controller('CharacterInfoController', function($scope, $state, character, characters, characterFactory, $stateParams, $firebaseArray, GameFactory, shortId) {

  $scope.shortId = shortId;
  $scope.character = character;
  $scope.counter = 0;

  var allCharRef = new Firebase("https://character-test.firebaseio.com/games/" + $stateParams.gameId + "/characters");

  $scope.imReady = function() {
    $scope.ready = true;
    allCharRef.child($stateParams.characterId).update({
      "playerReady": true
    });
  };

  $scope.numCharacters = characters.length;

  var numPlayers = 0;
  var totalNumOfPlayerSlots;

  $firebaseArray(allCharRef).$loaded()
    .then(function(characters) {
      totalNumOfPlayerSlots = characters.length;
      characters.forEach(function(character) {
        if (character.playerReady) numPlayers++;
      });

      $scope.numPlayersJoined = numPlayers;
    });

  allCharRef.on('child_changed', function(childSnapshot) {
    if (childSnapshot.val().playerReady) {
      $scope.numPlayersJoined++;
    }
  });

  $scope.fastSetup = function() {
    allCharRef.once('value', function(dataSnapshot) {
      dataSnapshot.forEach(function(character) {
        character.ref().update({
          playerReady: true
        });
      });
    });
  };

  var goToDashboard = function() {
    console.log("Getting here!");
    return $state.go('dashboard', {
      gameId: $stateParams.gameId,
      characterId: $stateParams.characterId
    }).then(null, function(error) {
      console.log(error);
    });
  };

  $scope.$watch('numPlayersJoined', function(newValue, oldValue) {
    if (newValue === totalNumOfPlayerSlots) {
      return GameFactory.triggerGameStart($stateParams.gameId)
        .then(function(somethingMaybe) {
          return goToDashboard();
        }).then(null, console.error);
    }
  });

});
