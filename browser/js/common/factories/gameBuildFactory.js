app.factory('gameBuildFactory', function($http) {
  return {
    createGame: function(gameToCreate) {
      return $http.post('/api/gameBuilder/gameInfo', gameToCreate)
        .then(function(res) {
          return res.data
        });
    },
    createCharacter: function(characterToCreate) {
      return $http.post('/api/gameBuilder/characterInfo', characterToCreate)
        .then(function(res) {
          return res.data
        });
    },
    createEvent: function(eventToCreate) {
      return $http.post('/api/gameBuilder/eventInfo', eventToCreate)
        .then(function(res) {
          return res.data
        });
    },
    pushCharacterToGame: function(gameId, characterId) {
      return $http.put('/api/gameBuilder/gameInfo/' + gameId + '/characters', {
          _id: characterId
        })
        .then(function(res) {
          return res.data
        });
    },
    pushEventToGame: function(gameId, eventId) {
      return $http.put('/api/gameBuilder/gameInfo/' + gameId + '/events', {
          _id: eventId
        })
        .then(function(res) {
          return res.data
        });
    },
    getGameCharacters: function(gameId) {
      return $http.get('/api/gameBuilder/' + gameId + '/characters')
        .then(function(res) {
          return res.data
        });
    },
    getGameEvents: function(gameId) {
      return $http.get('/api/gameBuilder/' + gameId + '/events')
        .then(function(res) {
          return res.data
        });
    },
    nestedList: function(theEvent) {
      var oneEvent = theEvent;
      if (oneEvent.type === 'choice') {
        oneEvent.columns = [oneEvent.decision.choices];
        oneEvent.columns[0].map(function(oneChoice) {
          var choice = oneChoice;
          choice.title = choice.choice;
          choice.type = 'text';
          choice.columns = [
            []
          ];
          return choice;
        });
      }
      if (oneEvent.type === 'text') {
        oneEvent.columns = [
          []
        ];
      }
      return oneEvent;
    }
  };
});
