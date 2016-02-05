app.factory('eventFactory', function($http) {
  var extractData = function(response) {
    return response.data;
  };

  var eventFactory = {};
  eventFactory.triggerEvent = function(eventId) {
    return $http.get('/api/game/event/' + eventId)
      .then(extractData);
  }

  return eventFactory;
});
