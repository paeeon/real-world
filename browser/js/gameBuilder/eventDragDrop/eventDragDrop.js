app.config(function($stateProvider) {
  $stateProvider.state('eventDragDrop', {
    url: '/game-builder/game-details',
    templateUrl: 'js/gameBuilder/eventDragDrop/eventDragDrop.html',
    controller: 'eventDragDropCtrl',
    resolve: {
      events: function(gameBuildFactory) {
        return gameBuildFactory.getGameEvents('56b81707c30db7263e5c1863');
      }
    }
  });
});

app.controller('eventDragDropCtrl', function($scope, $state, gameBuildFactory, events) {
  $scope.eventList = events.map(function(choiceEvent) {
    var oneEvent = choiceEvent;
    if (choiceEvent.type === 'choice') {
      choiceEvent.columns = [choiceEvent.decision.choices];
      choiceEvent.columns[0].map(function(oneChoice) {
        var choice = oneChoice;
        choice.title = choice.choice;
        choice.type = 'text';
        choice.columns = [[]];
        return choice;
      });
    } if (choiceEvent.type === 'text') {
      choiceEvent.columns = [[]];
    }
    return oneEvent;
  });

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

  $scope.$watch('models.dropzones', function(model) {
    $scope.modelAsJson = angular.toJson(model, true);
  }, true);
});
