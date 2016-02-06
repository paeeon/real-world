app.directive('decision', function($rootScope, $state, $animate) {

  return {
    restrict: 'E',
    scope: {
      decision: '=',
      game: '=',
      updateDecisionAnsweredStatus: '&'
    },
    templateUrl: 'js/common/directives/decision/decision.html',
    link: function(scope, element, attrs) {

      scope.closeDecision = function() {
        $animate.addClass(element, 'animated fadeOutLeft')
          .then(function() {
            element.remove();
          });
      };

      console.log("scope.decisionId");
      console.log(scope.decisionId);

      scope.selection = {};

      console.log("scope.decision");
      console.log(scope.decision);

      console.log("scope.character");
      console.log(scope.character);

      // the function that is called when a choice is chosen, so that the corresponding reaction function can be called
      scope.submitDecision = function() {
        console.log("scope.selection.value");
        console.log(scope.selection.value);
        var gameRef = new Firebase('https://character-test.firebaseio.com/games/' + scope.game.$id);
        gameRef.child('votes').child(scope.selection.value._id.id).push(scope.selection.value)
          .then(function() {
            return updateDecisionAnsweredStatus();
          }).then(function() {
            return $animate.addClass(element, 'animated fadeOutLeft')
          }).then(function() {
            element.remove();
          });
        // return choice.$value;
      };

    }
  };

});
