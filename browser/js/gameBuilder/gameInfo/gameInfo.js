app.config(function ($stateProvider) {
  $stateProvider.state('buildGame', {
    url: '/game-builder/game',
    templateUrl: 'js/gameBuilder/gameInfo/gameInfo.html',
    controller: 'buildGameCtrl'
  });
});

app.controller('buildGameCtrl', function($scope, $state, gameBuildFactory) {
  $scope.submitGame = function() {
    return gameBuildFactory.createGame($scope.game)
    .then(function(res) {
      var createdGame = res.data;
      console.log(createdGame);
      $state.go('buildCharacter', {gameId: createdGame._id});
    }).then(null, console.log);
  };
});
