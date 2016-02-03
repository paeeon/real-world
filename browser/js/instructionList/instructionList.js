app.config(function($stateProvider) {
  $stateProvider.state('instructionList', {
    url: '/games/all',
    templateUrl: 'js/instructionList/instructionList.html',
    controller: 'InstructionListController',
    resolve: {
      allInstructions: function(InstructionFactory) {
        return InstructionFactory.getAllInstructions()
      }
    }
  });
});

app.controller('InstructionListController', function($scope, $firebaseObject, $firebaseArray, InstructionFactory, $state, allInstructions) {

  console.log(allInstructions);
  $scope.allInstructions = allInstructions;

  $scope.buildGame = function(instructionId) {
    return InstructionFactory.buildGameFromInstructions(instructionId)
      .then(function() {
        $state.go('register');
      })
      .then(null, console.error);
  };

});
