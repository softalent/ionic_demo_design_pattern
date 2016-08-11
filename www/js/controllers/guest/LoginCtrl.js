angular.module('coordinate')
.config(function ($stateProvider) {
  $stateProvider
    .state('app.guest.login', {
        url: '/login',
        templateUrl: 'templates/guest/login.html',
        controller: 'LoginCtrl'
    });
})
.controller('LoginCtrl', function ($ionicLoading, $authWatch, $scope, $apiAuth, helper, $state, ionicMaterialInk) {
  $scope.loginData = {};


  $authWatch(function (loggedIn) {
    if(loggedIn) {
      $state.go("app.user.home", null, { location: 'replace' });
    }
  });

  ionicMaterialInk.displayEffect();

  $scope.doLogin = function() {

    var credentials = $scope.loginData;

    $ionicLoading.show({ template: 'Logging in, please wait.. '});

    $apiAuth.login(credentials.username, credentials.password)
      .then(function (data) {

        // clear form variables
        delete credentials.username;
        delete credentials.password;

      })
      .catch(function (err) {
        helper.showAlert(err);
      })
      .finally(function(){
        $ionicLoading.hide();
      });
  };
});