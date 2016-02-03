app.config(function ($stateProvider) {
    $stateProvider.state('characterInfo', {
        url: '/',
        templateUrl: 'js/characterInfo/characterInfo.html',
        resolve:{
        	character: function($stateParams, characterFactory) {
            return characterFactory.getCharacter($stateParams._id);
          }
        },
        controller: function($scope, character, $state){
        	$scope.character = character;
        	$scope.imReady = function(){
        		$state.go('dashboard', {_id:$scope.character._id})
        	}
        }
    });
});
