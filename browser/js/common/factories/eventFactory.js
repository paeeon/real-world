app.factory('eventFactory', function($http) {
  var extractData = function(response) {
    return response.data;
  };

  var eventFactory = {};
  eventFactory.triggerEvent = function(gameId, eventId) {
    return $http.get('/api/' + gameId + '/event/' + eventId)
      .then(extractData);
  }

  return eventFactory;
});
