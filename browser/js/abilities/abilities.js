app.config(function($stateProvider) {
  $stateProvider.state('abilities', {
    url: '/games/:gameId/character/:characterId/dashboard/abilities',
    templateUrl: 'js/abilities/abilities.html',
    controller: 'AbilitiesController',
    resolve: {
      game: function($stateParams, GameFactory) {
        return GameFactory.getOneGame($stateParams.gameId);
      },
      character: function($stateParams, characterFactory) {
        return characterFactory.getCharacter($stateParams.gameId, $stateParams.characterId);
      }
    }
  });
})

// The $firebaseArray dependency is more useful for managing collections
// (of messages for example).
app.controller('AbilitiesController', function($scope, $firebaseArray, $firebaseObject, character, game) {

  $scope.game = game;
  $scope.character = character;

  var gameRef = new Firebase('https://character-test.firebaseio.com/');
  var AbilitiesRef = new Firebase('https://character-test.firebaseio.com/games/' + game.$id + '/characters/' + $scope.character.$id + '/abilities');
  var LimitationsRef = new Firebase('https://character-test.firebaseio.com/games/' + game.$id + '/characters/' + $scope.character.$id + '/limitations');

  $scope.abilities = $firebaseArray(AbilitiesRef);
  $scope.limitations = $firebaseArray(LimitationsRef);



});
