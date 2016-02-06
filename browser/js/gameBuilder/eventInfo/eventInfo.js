app.config(function ($stateProvider) {
  $stateProvider.state('buildEvent', {
    url: '/game-builder/:gameId/event',
    templateUrl: 'js/gameBuilder/eventInfo/eventInfo.html',
    controller: 'buildEventCtrl',
    resolve: {
      characters: function(gameBuildFactory, $stateParams) {
        var gameId = $stateParams.gameId;
        return gameBuildFactory.getGameCharacters(gameId);
      }
    }
  });
});

app.controller('buildEventCtrl', function($scope, $stateParams, characters, gameBuildFactory) {
  $scope.characters = characters;
  $scope.cloneLists = [];
  $scope.listCharacters = function(index){
    $scope.cloneLists.push($scope.characters.slice(0))
    return $scope.cloneLists[index]
  }
  $scope.addEffect = function(){
    $scope.events.push({targets:[]});
  }
  $scope.removeEffect = function(index){
    if($scope.events.length > 1) $scope.events.splice(index,1);
  }
  $scope.addCharacter = function(character, targets, targetGroup){
    console.log(character)
    character = angular.fromJson(character);
    console.log(character)
    var index = _.findIndex(targetGroup, {name: character["name"]});
    targetGroup.splice(index,1);
    targets.push(character)

  }
  $scope.removeChar = function(index, targets, sourceChars){
    sourceChars.push(targets[index])
    targets.splice(index,1);
  }
  $scope.events = [{targets:[]}];
  var gameId = $stateParams.gameId;
  $scope.submitEvents = function() {
    // create events
    var eventPromises = $scope.events.map(function(event) {
      return gameBuildFactory.createEvent(event);
    });
    return $q.all(eventPromises)
    .then(function(resolvedEvents) {
      // use created events to push ids onto game.events
      var eventPush = resolvedEvents.map(function(event) {
        return gameBuildFactory.pushEventToGame(gameId, event._id);
      });
      return $q.all(eventPush);
    }).then(function(resolved) {
      // TODO: change this state.go?
      state.go('eventDetails', {gameId: gameId});
    }).then(null, console.log);
  };
});
