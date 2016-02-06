app.directive('message', function($rootScope, $state, $animate) {

  return {
    restrict: 'E',
    scope: {
      message: "="
    },
    templateUrl: 'js/common/directives/message/message.html',
    link: function(scope, element, attrs) {

      scope.closeMessage = function() {
        $animate.addClass(element, 'animated fadeOutLeft')
          .then(function() {
            element.remove();
          });
      };
    }

  };

});
