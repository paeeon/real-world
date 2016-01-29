app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeController'
    });
});

app.controller('HomeController', function($scope, $firebaseObject) {
  var ref = new Firebase('https://popping-heat-9764.firebaseio.com/');

  // Download the data into a local object
  var syncObject = $firebaseObject(ref);
  // P.S. ^ You could also do something like this:
  // $firebaseObject(ref.child('profiles').child('physicsmarie'));

  // Synchronize the object with three-way binding
  syncObject.$bindTo($scope, "data");
  // The database will now have a key 'text' with associated value of
  // whatever is typed into the input array in the home view.
});
