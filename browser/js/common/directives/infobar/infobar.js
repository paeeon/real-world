app.directive('infobar', function () {

    return {
        restrict: 'E',
        scope: {
            game: '=',
            character: '='
        },
        templateUrl: 'js/common/directives/infobar/infobar.html',
        link: function (scope) {

            console.log("GAME IS:", scope.game);
        }

    };

});
