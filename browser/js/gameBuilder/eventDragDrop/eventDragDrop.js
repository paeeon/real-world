app.config(function($stateProvider) {
  $stateProvider.state('eventDragDrop', {
    url: '/game-builder/:gameId/game-details',
    templateUrl: 'js/gameBuilder/eventDragDrop/eventDragDrop.html',
    controller: 'eventDragDropCtrl',
    resolve: {
      events: function(gameBuildFactory, $stateParams) {
        var gameId = $stateParams.gameId;
        return gameBuildFactory.getGameEvents(gameId);
      }
    }
  });
});

app.controller('eventDragDropCtrl', function($scope, $state, $stateParams, gameBuildFactory, events) {
  var gameId = $stateParams.gameId;

  $scope.eventList = events.map(function(theEvent) {
    return gameBuildFactory.nestedList(theEvent);
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

  $scope.submitNest = function(events) {
    return gameBuildFactory.saveNestedEvents(events);
  };

  $scope.$watch('models.dropzones', function(model) {
    $scope.modelAsJson = angular.toJson(model, true);
  }, true);
});
