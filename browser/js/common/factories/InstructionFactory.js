app.factory("InstructionFactory", function($http) {
  var extractData = function(response) {
    return response.data;
  };

  return {
    getAllInstructions: function() {
      return $http.get('/api/game/')
        .then(extractData);
    },
    buildGameFromInstructions: function(instructionId) {
      return $http.get('/api/game/build/' + instructionId)
        .then(function(response) {
          console.log("response is", response);
          return response.data;
        });
    }
  };
});
