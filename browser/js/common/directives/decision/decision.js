app.directive('decision', function($rootScope, $state, $animate) {

  return {
    restrict: 'E',
    scope: {
      decision: '='
    },
    templateUrl: 'js/common/directives/decision/decision.html',
    link: function(scope, element, attrs) {
      console.log(scope.decision);
      scope.closeDecision = function() {
        $animate.addClass(element, 'animated fadeOutLeft')
          .then(function() {
            element.remove();
          });
      };

      scope.selection = [];

      scope.$watchCollection('selection', function(newValue, oldValue) {
        console.log("new", newValue);
        console.log("old", oldValue);
      });
    }
};

});
