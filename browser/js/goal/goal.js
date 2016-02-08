app.config(function($stateProvider) {
  $stateProvider.state('goal', {
    url: '/games/:gameId/character/:characterId/dashboard/goal',
    templateUrl: 'js/goal/goal.html',
    controller: 'GoalController',
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

app.controller('GoalController', function($scope, $firebaseObject, $firebaseArray, $http, $state, character, $rootScope, game) {
  console.log("game", game);

  $scope.game = game;
  $scope.character = character;
  $rootScope.inGame = true;
  $scope.gameTitle = game.title;

  $scope.character = character;

  var GoalRef = new Firebase('https://character-test.firebaseio.com/games/' + game.$id + '/characters/' + $scope.character.$id + '/goals');

  $scope.goals = $firebaseArray(GoalRef);
});
