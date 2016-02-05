app.factory('characterFactory', function($http, $firebaseObject, $firebaseArray){
	var characterFactory = {};
	characterFactory.getCharacter = function(gameId, characterId) {
		var charRef = new Firebase("https://character-test.firebaseio.com/games/" + gameId + "/characters/" + characterId);
    return $firebaseObject(charRef).$loaded()
      .then(function(character) {
        return character;
      });
	};

  characterFactory.joinGame = function(gameToAddCharacterTo, name, phone){
    return $http.post('api/game/' + gameToAddCharacterTo + '/register-character/', { playerName: name, playerNumber: phone })
      .then(function(response){
        return response.data;
      });
  };

  characterFactory.allCharacters = function(gameId) {
    var allCharRef = new Firebase("https://character-test.firebaseio.com/games/" + gameId + "/characters");
     return $firebaseArray(allCharRef).$loaded()
     .then(function(characters){
        return characters;
     })
  }

  // characterFactory.numPlayersInGame = function(gameId) {

  // }

	return characterFactory;
});
