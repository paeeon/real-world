app.directive('message', function($rootScope, $state) {

  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'js/common/directives/message/message.html',
    link: function(scope, element, attrs) {
      scope.closeMessage = function() {
        element.children('.close-message').on('click', function() {
          element.remove();
        });
      }
    }

  };

});
