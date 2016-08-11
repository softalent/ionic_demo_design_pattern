// Coordinate Mobile App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'coordinate' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('coordinate', ['ionic', 'ionic-material'])
.constant('DEBUGGING', false)
.run(function ($ionicPlatform, $state, $apiAuth) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
        StatusBar.styleDefault();
    }

    if(!$apiAuth.authenticated) { // TODO: this needs to be reworked into a generalzed function that tracks tokens / user state.

      var
      credentials = $apiAuth.lastCredentials;

      if(credentials) {
        return $apiAuth.login(credentials.username, credentials.password)
          .then(function (data) {
            return $state.go('app.user.home', null, { location: 'replace' });
          })
          .catch(function (err) { // return back to login state with error message parameter
            return $state.go('app.guest.login', { error: err }, { location: 'replace' });
          });
      }
      else {
        return $state.go('app.guest.login', null, { location: 'replace' });
      }
    }
  });
})
.config(function ($httpProvider, $urlRouterProvider) {

  // handle token authentication over http
  $httpProvider.interceptors.push('authInterceptor');

  // set default content-type header for all requests
  $httpProvider.defaults.headers.common = {
    'Content-Type': 'application/json;charset=UTF-8'
  };
});