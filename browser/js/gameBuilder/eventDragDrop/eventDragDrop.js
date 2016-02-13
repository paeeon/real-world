app.config(function($stateProvider) {
  $stateProvider.state('eventDragDrop', {
    url: '/game-builder/:gameId/game-details',
    templateUrl: 'js/gameBuilder/eventDragDrop/eventDragDrop.html',
    controller: 'eventDragDropCtrl',
    resolve: {
      events: function(gameBuildFactory, $stateParams) {
        var gameId = $stateParams.gameId;
        return gameBuildFactory.getGameEvents(gameId);
      },
      characters: function(gameBuildFactory, $stateParams){
        var gameId = $stateParams.gameId;
        return gameBuildFactory.getGameCharacters(gameId);
      }
    }
  });
});

app.controller('eventDragDropCtrl', function($scope, $state, $stateParams, gameBuildFactory, events, characters) {
  var gameId = $stateParams.gameId;
  $scope.characters = characters;
  $scope.addChoice = function(choice, goal){
    goal.acceptedValues.push(choice)
    console.log($scope.characters)
  }

  $scope.goalType = function(goal){
    return goal.type === 'event'
  }
  $scope.hasEventGoals = function(goals){
    var numEventGoals = goals.filter(function(goal){
      return $scope.goalType(goal)
    })
    return numEventGoals.length > 0;
  }

  $scope.eventList = events.map(function(theEvent) {
    return gameBuildFactory.nestedList(theEvent);
  });

  $scope.choiceEvents = events.filter(function(event){
    return event.type == 'choice'
  })

  $scope.getChoices = function(eventId){
    if (eventId){
      return $scope.choiceEvents.filter(function(event){
        return event._id == eventId;
      })[0].decision.choices;
    }
  }

  $scope.models = {
    selected: null,
    templates: [{
      type: "item",
      id: 2
    }, {
      type: "container",
      id: 1,
      columns: [
        [],
        []
      ]
    }],
    dropzones: {
      A: []
    }
  };

  $scope.submitNest = function(events, characters) {
    gameBuildFactory.updateCharacterGoals(characters).then(null, console.log)
    .then(function(){
    return gameBuildFactory.saveNestedEvents(events)
      .then(function() {
        $state.go('instructionList');
      });
    }).then(null, console.log)
  };

  $scope.$watch('models.dropzones', function(model) {
    $scope.modelAsJson = angular.toJson(model, true);
  }, true);
});
