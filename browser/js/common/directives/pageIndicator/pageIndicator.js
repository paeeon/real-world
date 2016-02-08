app.directive('pageIndicator', function() {

  return {
    restrict: 'E',
    templateUrl: 'js/common/directives/pageIndicator/pageIndicator.html',
    link: function(scope, element, attrs) {

      console.log("Inside the pager directive…");
      // console.log(scope.page);

    }

  };

});
