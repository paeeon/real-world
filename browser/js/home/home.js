app.config(function($stateProvider) {
  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'js/home/home.html',
    controller: 'HomeController',
    resolve: {
      allInstructions: function(InstructionFactory) {
        return InstructionFactory.getAllInstructions();
      }
    }
  });
});

app.controller('HomeController', function($scope, allInstructions) {

  $scope.allInstructions = allInstructions;



});
