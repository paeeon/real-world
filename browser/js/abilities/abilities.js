app.config(function($stateProvider) {
  $stateProvider.state('abilities', {
    url: '/abilities',
    templateUrl: 'js/abilities/abilities.html',
    controller: 'AbilitiesController'
  });
})

// The $firebaseArray dependency is more useful for managing collections
// (of messages for example).
app.controller('AbilitiesController', function($scope, $firebaseArray) {
  var ref = new Firebase('https://popping-heat-9764.firebaseio.com/messges');

  // Create a synchronized array
  $scope.messages = $firebaseArray(ref);

  // Never use methods on synchronized arrays that would modify the array
  // in place! It is possible to lose track of the array indices and
  // corrupt the data. Instead, AngularFire recommends that we use the
  // following compatible methods: $add(), $save(), and $remove().

  // Here's $add, which adds new items to the array.
  $scope.addMessage = function() {
    // No .push() necessary, see?
    $scope.messages.$add({
      text: $scope.newMessageText
    });
  };
});
