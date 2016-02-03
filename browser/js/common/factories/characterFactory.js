app.factory('characterFactory', function($http){
	var characterFactory = {};
	characterFactory.getCharacter = function (characterID){
		$http.get('/api/character/' + characterID)
		.then(null, next)
	};

  characterFactory.joinGame = function(gameToAddCharacterTo, name, phone){
    return $http.post('api/game/' + gameToAddCharacterTo + '/register-character/', { playerName: name, playerNumber: phone })
      .then(function(response){
        return response.data;
      });
  };
	return characterFactory;
})
