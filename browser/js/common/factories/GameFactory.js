app.factory('GameFactory', function($http, $firebaseObject) {
  var extractData = function(response) {
    console.log("Getting to the extractData function! Here's the response from the server…");
    console.log(response);
    return response.data;
  };

  var fac = {
    triggerGameStart: function(gameId) {
      return $http.get('/api/game/start/' + gameId)
        .then(extractData);
    },
    getOneGame: function(gameId) {
      return $firebaseObject(new Firebase('https://character-test.firebaseio.com/games/' + gameId));
    },
    getShortId: function(realGameId) {
      var firebaseRef = new Firebase('https://character-test.firebaseio.com/games/gameShortIdConverter');
      return firebaseRef.once('value')
        .then(function(snapshot) {
          var shortId;
          snapshot.forEach(function(childSnapshot) {
            if (childSnapshot.val() === realGameId) shortId = childSnapshot.key();
          });
          return shortId;
        }).then(null, function(error) {
          console.log("Error getting game with short ID in the factory!");
          console.log(error);
        });
    }
  };

  return fac;
});
