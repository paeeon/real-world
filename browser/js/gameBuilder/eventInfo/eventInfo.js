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

app.controller('buildEventCtrl', function($scope, $stateParams, characters, $q, gameBuildFactory, $state) {
  $scope.events = [{targets:[], decision:{choices:[]}}];

  var gameId = $stateParams.gameId;

  $scope.characters = characters;
  $scope.cloneLists = [];

  $scope.addEffect = function(){
    $scope.events.push({targets:[], decision:{choices:[]}});
  }

  $scope.removeEffect = function(index){
    if($scope.events.length > 1) $scope.events.splice(index,1);
  }

  $scope.listCharacters = function(index){
    $scope.cloneLists.push($scope.characters.slice(0))
    return $scope.cloneLists[index]
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

  $scope.addChoice = function(currentEvent){
    console.log(currentEvent)
    currentEvent.decision.choices.push({choice:currentEvent.currentChoice})
    currentEvent.currentChoice = '';
  }

  $scope.removeChoice = function(index, currentEvent){
    currentEvent.decision.choices.splice(index,1)
  }

  $scope.isDecision = function(currentEvent){
    if (currentEvent.type === "Decision") return true;
    else return false;
  }

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
      $state.go('eventDragDrop', {gameId: gameId});
    }).then(null, console.log);
  };
});
