app.factory('eventFactory', function($http) {
  var extractData = function(response) {
    console.log(response.data);
    return response.data;
  };

  var eventFactory = {};
  eventFactory.triggerEvent = function(eventId) {
    return $http.get('/api/game/event/' + eventId)
      .then(extractData);
  }

  return eventFactory;
})
