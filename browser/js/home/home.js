app.config(function($stateProvider) {
  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'js/home/home.html',
    controller: 'HomeController'
  });
});

app.controller('HomeController', function($scope, $firebaseObject, $state) {
  var games = new Firebase("https://character-test.firebaseio.com/games/");
  var realID;

  $scope.joinExistingGame = function() {
    //a firebase object of the shortIDs matched to the real game IDs
    $firebaseObject(games).$loaded()
    .then(function(games){
      //get the realID and set it to a variable
      realID = games.gameShortIdConverter[$scope.gameID];
      console.log(realID);
      //go to the register state with the realID
      $state.go('register', { gameId: realID });
    })
  };

});
