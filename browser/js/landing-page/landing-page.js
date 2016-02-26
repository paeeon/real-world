app.config(function($stateProvider) {
  $stateProvider.state('landingPage', {
    url: '/',
    templateUrl: 'js/landing-page/landing-page.html',
    controller: 'LandingPageCtrl'
  });
});

app.controller('LandingPageCtrl', function($scope) {

});
