angular.module('coordinate')
.config(function ($stateProvider) {
  $stateProvider
    .state('app', {
      url: '',
      controller: 'AppCtrl',
      templateUrl: 'templates/app.html'
    });
})
.controller('AppCtrl', function ($scope, $apiAuth, $state) {
  $scope.$on('destroy', $scope.$watch(function(){
    return $state.current.name;
  }, function (name) {
    if(name === 'app') { // when at root, forward user to happy place
      $state.go($apiAuth.authenticated ? 'app.user.home' : 'app.guest.login');
    }
  }))
})
.run(function ($rootScope, $ionicLoading, helper) {

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
    if(toState.data && toState.data.loadingTemplate) {
      $ionicLoading.show({
        template: toState.data.loadingTemplate
      });
    }
  });

  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    if(toState.data && toState.data.loadingTemplate) {
      $ionicLoading.hide();
    }
  });

  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    console.error('$stateChangeError', arguments);

    if(toState.data && toState.data.loadingTemplate) {
      $ionicLoading.hide();
    }

    helper.showAlert(error);
  });
});