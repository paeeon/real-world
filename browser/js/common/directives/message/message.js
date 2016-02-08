app.directive('message', function($rootScope, $state, $animate) {

  return {
    restrict: 'E',
    scope: {
      message: "=",
      game: "=",
      character: "="
    },
    templateUrl: 'js/common/directives/message/message.html',
    link: function(scope, element, attrs) {

      scope.closeMessage = function() {
        var charMessageRef = new Firebase('https://character-test.firebaseio.com/games/' + scope.game.$id + '/characters/' + scope.character.$id + '/message');
        return charMessageRef.once("value")
          .then(function(snapshot) {
            var messageToUpdate;
            snapshot.forEach(function(childSnapshot) {
              if (childSnapshot.val().message === scope.message.message) messageToUpdate = childSnapshot.key();
            });
            return charMessageRef.child(messageToUpdate).update({seen: true});
          }).then(function() {
            element.remove();
          });
      };
    }

  };

});
