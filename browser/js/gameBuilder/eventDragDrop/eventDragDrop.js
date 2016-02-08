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
      choiceEvent.columns = [choiceEvent.decision.choices]
      choiceEvent.columns[0].map(function(oneChoice) {
        var choice = oneChoice;
        choice.title = choice.choice;
        choice.type = 'text';
        choice.columns = [[]];
        return choice;
      });
    } if (choiceEvent.type === 'text') {
      choiceEvent.columns = [[]]
    }
    // console.log(oneEvent);
    return oneEvent;
  });

  console.log($scope.eventList);
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
      // "A": [{
      //   "type": "container",
      //   "id": 1,
      //   "columns": [
      //     [{
      //       "type": "item",
      //       "id": "1"
      //     }, {
      //       "type": "item",
      //       "id": "2"
      //     }],
      //     [{
      //       "type": "item",
      //       "id": "3"
      //     }]
      //   ]
      // }, {
      //   "type": "item",
      //   "id": "4"
      // }, {
      //   "type": "item",
      //   "id": "5"
      // }, {
      //   "type": "item",
      //   "id": "6"
      // }],
      // "B": [{
      //   "type": "container",
      //   "title": 'container',
      //   "columns": [[{
      //     "type": "container",
      //     "title": 'container',
      //     "columns": [[{
      //       "type": "container",
      //       "title": 'container',
      //       "columns": [[], []],
      //       "id": 16
      //     }], []],
      //     "id": 16
      //   }], []],
      //   "id": 16
      // }]
    }
  };

  $scope.$watch('models.dropzones', function(model) {
    $scope.modelAsJson = angular.toJson(model, true);
  }, true);
});
