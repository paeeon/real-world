app.config(function ($stateProvider) {
  $stateProvider.state('buildCharacter', {
    url: '/game-builder/:gameId/character',
    templateUrl: 'js/gameBuilder/characterInfo/characterInfo.html',
    controller: 'buildCharacter'
  });
});

app.controller('buildCharacter', function($scope, $q, $state, $stateParams, gameBuildFactory) {
  var gameId = $stateParams.gameId;
  $scope.characters = [{}];
  console.log(gameId)
  $scope.thingthatwillfail = function(){console.log($scope.characters)};
  $scope.addNew = function(){
    $scope.characters.push({});
  }
  $scope.remove = function(index){
    console.log(index)
    if($scope.characters.length > 1) $scope.characters.splice(index,1);
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
