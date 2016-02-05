app.factory('gameBuildFactory', function($http) {
  return {
    createGame: function(gameToCreate) {
      return $http.post('/api/gameBuilder/gameInfo', gameToCreate);
    },
    createCharacter: function(characterToCreate) {
      return $http.post('/api/gameBuilder/characterInfo', characterToCreate);
    },
    createEvent: function(eventToCreate) {
      return $http.post('/api/gameBuilder/eventInfo', eventToCreate);
    },
    pushCharacterToGame: function(gameId, characterId) {
      return $http.put('/api/gameBuilder/gameInfo/' + gameId + '/characters',
        { _id: characterId });
    },
    pushEventToGame: function(gameId, eventId) {
      return $http.put('/api/gameBuilder/gameInfo/' + gameId + '/events',
        { _id: eventId });
    },
    getGameCharacters: function(gameId) {
      return $http.get('/api/gameBuilder/' + gameId + '/characters');
    },
    getGameEvents: function(gameId) {
      return $http.get('/api/gameBuilder/' + gameId + '/events');
    }
  };
});
