app.config(function($stateProvider) {
  $stateProvider.state('register', {
    url: '/games/:gameId/register',
    templateUrl: 'js/registerChar/registerChar.html',
    controller: 'regController',
    resolve: {
      gamesCharacters: function($stateParams) {
        console.log("gameID is", $stateParams.gameId);
        return new Firebase("https://character-test.firebaseio.com/games/" + $stateParams.gameId + "/characters");
      },
      shortId: function($stateParams, GameFactory) {
        return GameFactory.getShortId($stateParams.gameId);
      }
    }
  });
});

app.controller('regController', function($scope, $http, $state, characterFactory, $stateParams, $firebaseArray, gamesCharacters, shortId) {
  $scope.gameFull = false;
  $scope.shortId = shortId;
  console.log("Here is the shortId")
  console.log(shortId);

  $firebaseArray(gamesCharacters).$loaded()
  .then(function(characters) {
      $scope.roomLeftInGame = characters.length;
      characters.forEach(function(character) {
        if (character.$id && character.playerName) {
          $scope.roomLeftInGame--;
        }
      });
      if ($scope.roomLeftInGame === 0) $scope.gameFull = true;
    })

    gamesCharacters.on('child_changed', function(dataSnap){
      $scope.roomLeftInGame--;
    })

  $scope.joinGame = function() {
    characterFactory.joinGame($stateParams.gameId, $scope.player.name, $scope.player.phoneNumber)
      .then(function(character) {
        $state.go('characterInfo', { gameId: $stateParams.gameId, characterId: character._id });
      })
  };


})
