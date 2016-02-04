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
      }
    }
  });
});

app.controller('CharacterInfoController', function($scope, $state, character, characters, characterFactory, $stateParams, $firebaseArray) {

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

  $firebaseArray(allCharRef).$loaded()
    .then(function(characters) {
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

  $scope.$watch('numPlayersJoined', function(newValue, oldValue) {
    if (newValue === 10) $state.go('dashboard', { gameId: $stateParams.gameId, characterId: $stateParams.characterId });
  });

});
