app.factory('characterFactory', function($http){
	characterFactory = {};
	characterFactory.getCharacter = function (characterID){
		$http.get('/api/character/' + characterID)
		.then(null, next)
	}
	return characterFactory;
})