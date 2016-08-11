angular.module('coordinate')
.config(function ($stateProvider) {
  $stateProvider
    .state('app.user', {
      abstract: true,
      views: {
        windowApp: {
          templateUrl: 'templates/app.user.html',
          controller: 'AppUserCtrl'
        }
      },
      resolve: {
        '$user': ['$apiAuth', function ($apiAuth) { // this will fail if user is not authenticated
          return $apiAuth.getProfile();
        }]
      }
    });
})
.controller('AppUserCtrl', function ($scope, $apiAuth, $state, $user) {
  $scope.currentUser = $user;

  $scope.logout = function () {
    return $apiAuth.logout()
      .finally(function () {
        $state.go("app.guest.login", null, { location: 'replace' });
      });
  };
});