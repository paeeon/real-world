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

app.controller('buildEventCtrl', function($scope, $stateParams, $state, characters, $q, gameBuildFactory) {

  $scope.events = [{targets:[], decision:{choices:[]}}];
  var gameId = $stateParams.gameId;

  $scope.characters = characters;
  $scope.cloneLists = [];

  $scope.models = {
    selected: null,
     lists: {
       "A": [],
       "B": []
     }
   };

  // Generate initial model
  for (var i = 1; i <= 3; ++i) {
    $scope.models.lists.A.push({
      label: "Item A" + i
    });
    $scope.models.lists.B.push({
      label: "Item B" + i
    });
  }

  // Model to JSON for demo purpose
  $scope.$watch('models', function(model) {
    $scope.modelAsJson = angular.toJson(model, true);
  }, true);

  console.log("Here are the models");
  console.log($scope.models);

  // Add an effect for this event. Each effect will act as its own
  // "event" in the game
  $scope.addEffect = function(){
    $scope.events.push({targets:[], decision:{choices:[]}});
  }

  $scope.removeEffect = function(index){
    if($scope.events.length > 1) $scope.events.splice(index,1);
  }

 // dynamcially populate the character list for each added effect
  $scope.listCharacters = function(index){
    $scope.cloneLists.push($scope.characters.slice(0))
    return $scope.cloneLists[index]
  }

 // add character to effect
  $scope.addCharacter = function(character, targets, targetGroup){
    character = angular.fromJson(character);
    var index = _.findIndex(targetGroup, {name: character["name"]});
    targetGroup.splice(index,1);
    targets.push(character);

  }

  $scope.removeChar = function(index, targets, sourceChars){
    sourceChars.push(targets[index])
    targets.splice(index,1);
  }

  // add a choice to a decision event
  $scope.addChoice = function(currentEvent){
    console.log(currentEvent)
    currentEvent.decision.choices.push({choice:currentEvent.currentChoice})
    currentEvent.currentChoice = '';
  }

  $scope.removeChoice = function(index, currentEvent){
    currentEvent.decision.choices.splice(index,1)
  }

  //value toggles display of decision form
  $scope.isDecision = function(currentEvent){
    if (currentEvent.type === "Decision") return true;
    else return false;
  }

  $scope.submitEvents = function() {
    $scope.events.forEach(function(currentEvent){
      console.log(currentEvent)
      // place title on events
      currentEvent.title = $scope.name.title;
      //reassign targets to be solely character IDs
      currentEvent.targets = currentEvent.targets.map(function(target){
        return target._id;
      })
    })
    console.log($scope.events)
    var eventPromises = $scope.events.map(function(eventA) {
      return gameBuildFactory.createEvent(eventA);
    });
    // create events
    return $q.all(eventPromises)
    .then(function(resolvedEvents) {
      console.log(resolvedEvents)
      // use created events to push ids onto game.events
      var eventPush = resolvedEvents.map(function(eventA) {
        return gameBuildFactory.pushEventToGame(gameId, eventA._id);
      });
      return $q.all(eventPush);
    }).then(function(resolved) {
      $state.go('eventDragDrop', {gameId: gameId});
    }).then(null, console.log);
  };

});
