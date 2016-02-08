app.directive('decision', function($rootScope, $state) {

  return {
    restrict: 'E',
    scope: {
      decision: '=',
      game: '=',
      character: '='
    },
    templateUrl: 'js/common/directives/decision/decision.html',
    link: function(scope, element, attrs) {

      console.log("Inside the decision directive");
      console.log("scope.decision");
      console.log(scope.decision);

      scope.closeDecision = function() {
        element.remove();
      };

      scope.selection = {};

      // the function that is called when a choice is chosen, so that the corresponding reaction function can be called
      scope.submitDecision = function() {
        var gameRef = new Firebase('https://character-test.firebaseio.com/games/' + scope.game.$id);
        var choice = {
          _id: scope.selection.value._id,
          choice: scope.selection.value.choice
        };
        return gameRef.child('votes').child(scope.decision.eventId).push(choice)
          .then(function() {
            return gameRef.child('characters').child(scope.character.$id).child('decisions').once("value");
          }).then(function(snapshot) {
            var decisionToUpdate;
            snapshot.forEach(function(childSnapshot) {
              if (childSnapshot.val().eventId === scope.decision.eventId) decisionToUpdate = childSnapshot.key();
            });
            return gameRef.child('characters').child(scope.character.$id).child('decisions').child(decisionToUpdate).update({answered: true});
          }).then(function() {
            element.remove();
          });
        // return choice.$value;
      };

    }
  };

});
