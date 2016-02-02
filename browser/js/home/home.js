app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeController'
    });
});

app.controller('HomeController', function($scope, $firebaseObject, $firebaseArray, $http, $state) {
  // var ref = new Firebase('https://popping-heat-9764.firebaseio.com/');

  var ref = new Firebase('https://character-test.firebaseio.com/Andrew/Decision/choice');
  var decisionRef = new Firebase('https://character-test.firebaseio.com/Andrew/Decision/answered');

  // Download the data into a local object
  // var syncObject = $firebaseObject(ref);
  // P.S. ^ You could also do something like this:
  // $firebaseObject(ref.child('profiles').child('physicsmarie'));

  // var syncObject = $firebaseObject(ref);


  // Synchronize the object with three-way binding
  // syncObject.$bindTo($scope, "data");
  // The database will now have a key 'text' with associated value of
  // whatever is typed into the input array in the home view.

  // syncObject.$bindTo($scope, "data");

  //an array of all the choices
  $scope.choices = $firebaseArray(ref);

  //access to the answered key
  $scope.answered = $firebaseObject(decisionRef);

  //three way data binding so that when an answer is chosen, it changes answered to true
  $scope.answered.$bindTo($scope, "answered");

  //the function that is called when a choice is chosen, so that the corresponding reaction function can be called
  $scope.choose = function(choice) {
    console.log(choice.$value);
    $scope.answered.$value = true;
    return choice.$value;
  }

  $scope.build = function(){
    $http.get('/api/game/build').then(function(response){
      console.log(response.data);
      $state.go('register');
    })
  }
});
