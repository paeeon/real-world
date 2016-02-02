app.factory('eventFactory', function($http){
	eventFactory = {};
	eventFactory.triggerEvent = function (eventId){
		$http.get('/api/game/event/' + eventId)
		.then(null, next)
	}
	return eventFactory;
})