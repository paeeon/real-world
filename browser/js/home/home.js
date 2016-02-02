app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeController'
    });
});

app.controller('HomeController', function($scope, $firebaseObject, $firebaseArray, HomeFactory, $state) {
  $scope.build = function(){
    console.log("hi");
      return HomeFactory.buildGame()
      .then(function(){
        $state.go('register');
      })
      .then(null,console.error);
  }

});

app.factory('HomeFactory', function($http) {
  return {
    buildGame : function () {
      return $http.get('api/game/build')
      .then(function(response){
        console.log("response is", response);
        return response.data;
      })
    }
  }
})
