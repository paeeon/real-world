app.config(function ($stateProvider) {
  $stateProvider.state('buildCharacter', {
    url: '/game-builder/:gameId/character',
    templateUrl: 'js/gameBuilder/characterInfo/characterInfo.html',
    controller: 'buildCharacter'
  });
});

app.controller('buildCharacter', function($scope, $q, $state, $stateParams, gameBuildFactory) {
  var gameId = $stateParams.gameId;
  $scope.characters = [{goals:[{}]}];

  //add new character to game
  $scope.addNew = function(){
    $scope.characters.push({goals:[{}]});
  }
  $scope.remove = function(index){
    if($scope.characters.length > 1) $scope.characters.splice(index,1);
  }
  $scope.goalType = function(goal){
    return goal.type === 'event'
  }
  $scope.submitCharacters = function() {
    // create characters
    var charPromises = $scope.characters.map(function(character) {
      return gameBuildFactory.createCharacter(character);
    });
    return $q.all(charPromises)
    .then(function(resolvedCharacters) {
      // use created characters to push ids onto game.characters
      var characterPush = resolvedCharacters.map(function(character) {
        return gameBuildFactory.pushCharacterToGame(gameId, character._id);
      });
      return $q.all(characterPush);
    }).then(function(resolved) {
      $state.go('buildEvent', {gameId: gameId});
    }).then(null, console.log);
  };
});
