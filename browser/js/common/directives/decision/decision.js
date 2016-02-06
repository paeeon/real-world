app.directive('decision', function($rootScope, $state, $animate) {

  return {
    restrict: 'E',
    scope: {
      decision: '=',
      game: '='
    },
    templateUrl: 'js/common/directives/decision/decision.html',
    link: function(scope, element, attrs) {

      console.log("scope.decision…");
      console.log(scope.decision);

      scope.closeDecision = function() {
        $animate.addClass(element, 'animated fadeOutLeft')
          .then(function() {
            element.remove();
          });
      };

      scope.selection = {};

      // the function that is called when a choice is chosen, so that the corresponding reaction function can be called
      scope.submitDecision = function() {
        var gameRef = new Firebase('https://character-test.firebaseio.com/games/' + scope.game.$id);
        var choice = {
          _id: scope.selection.value._id,
          choice: scope.selection.value.choice
        };
        gameRef.child('votes').child(choice._id).push(choice)
          .then(function() {
            return $animate.addClass(element, 'animated fadeOutLeft')
          }).then(function() {
            element.remove();
          });
        // return choice.$value;
      };

    }
  };

});
