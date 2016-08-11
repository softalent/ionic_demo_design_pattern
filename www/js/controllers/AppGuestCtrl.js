angular.module('coordinate')
.config(function ($stateProvider) {
  $stateProvider
    .state('app.guest', {
      abstract: true,
      views: {
        windowApp: {
          templateUrl: 'templates/app.guest.html',
          controller: 'AppGuestCtrl'
        }
      }
    });
})
.controller('AppGuestCtrl', function ($scope, $apiAuth, $state) {
});