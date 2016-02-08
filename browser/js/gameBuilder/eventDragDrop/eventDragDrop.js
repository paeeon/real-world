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

  $scope.$watch('models.dropzones', function(model) {
    $scope.modelAsJson = angular.toJson(model, true);
  }, true);
});
