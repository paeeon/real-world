app.factory('characterFactory', function($http) {
  var extractData = function(response) {
    console.log(response.data);
    return response.data;
  };

  var characterFactory = {};

  characterFactory.getCharacter = function(characterID) {
    return $http.get('/api/character/' + characterID)
      .then(extractData);
  };

  return characterFactory;
});
