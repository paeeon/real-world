app.factory("InstructionFactory", function($http) {
  var extractData = function(response) {
    console.log(response.data);
    return response.data;
  };

  return {
    getAllInstructions: function() {
      return $http.get('/api/game/')
        .then(extractData);
    },
    buildGameFromInstructions: function(instructionId) {
      return $http.get('/api/game/build/' + instructionId)
        .then(extractData);
    }
  };

});
