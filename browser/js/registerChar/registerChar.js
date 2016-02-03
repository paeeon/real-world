app.config(function ($stateProvider) {
    $stateProvider.state('register', {
        url: '/register',
        templateUrl: 'js/registerChar/registerChar.html',
        controller: 'regController'
    });
});

app.controller('regController', function($scope, $http, $state){
	$scope.start = function(){
		$http.post('api/game/register', {name:$scope.data.text})
			.then(function(response){
				$state.go('characterInfo', response.data)
			})
	}
})