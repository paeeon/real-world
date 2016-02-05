app.config(function ($stateProvider) {
  $stateProvider.state('buildEvent', {
    url: '/game-builder/event',
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
