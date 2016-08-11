angular.module('coordinate')

//
// Specialized service for storage of coordinate credentials
// and user auth state.
//
.service('$storageAuth', function ($storage) {
  var
  LS_TOKEN = 'coordinateToken',
  LS_USER  = 'coordinateUsername',
  LS_PASS  = 'coordinatePassword';

  Object.defineProperties(this, {
    authenticated: {
      get: function () {
        return this.isAuthenticated();
      }
    },
    token: {
      get: function () {
        return this.getToken();
      }
    }
  });

  this.clearToken = function () {
    $storage.unset(LS_TOKEN);
    return this;
  };

  this.clearCredentials = function () {
    $storage.unset(LS_USER);
    $storage.unset(LS_PASS);
    return this;
  };

  this.getCredentials = function () {

    var
    user = $storage.get(LS_USER)||null,
    pass = $storage.get(LS_PASS)||null;

    if(user === null || pass === null) {
      return false;
    }

    return {
      username: user,
      password: pass
    };
  };

  this.setCredentials = function (username, password) {
    $storage.set(LS_USER, username||null);
    $storage.set(LS_PASS, password||null);
    return this;
  };

  this.getToken = function () {
    return $storage.get(LS_TOKEN)||null;
  };

  this.setToken = function (token) {
    $storage.set(LS_TOKEN, token);
    return this;
  };

  this.isAuthenticated = function () {
    return this.getToken() !== null;
  };
})

//
// Watcher utility function for authentication events
//
.service('$authWatch', function ($rootScope, $storageAuth) {
  return function (cb) {
    var
    authenticated = $storageAuth.authenticated,
    kcbLoggedIn   = angular.noop,
    kcbLoggedOut  = angular.noop,
    notifyCb = function () {
      cb.call($storageAuth, $storageAuth.authenticated);
    };

    if(angular.isFunction(cb)) {
      kcbLoggedIn = $rootScope.$on('$apiAuthLogin', notifyCb);
      kcbLoggedOut = $rootScope.$on('$apiAuthLogout', notifyCb);
      notifyCb();
    }

    return function () { // kill watchers callback
      kcbLoggedIn();
      kcbLoggedOut();
    };
  };
})

//
// Service for performing authentication
//
.service('$apiAuth', function ($rootScope, $http, $httpSuccessDebug, $httpErrorDebug, $q, $storageAuth, $coordinateUrl) {

  // convienence property aliases
  Object.defineProperties(this, {
    authenticated: {
      get: function () {
        return this.isAuthenticated();
      }
    },
    lastCredentials: {
      get: function () {
        return this.getCredentials();
      }
    }
  });

  // convienence methods for storageAuth
  this.isAuthenticated = $storageAuth.isAuthenticated.bind($storageAuth);
  this.getCredentials = $storageAuth.getCredentials.bind($storageAuth);

  this.getProfile = function () {
    var defer = $q.defer();

    $http({
      method: 'GET',
      url: $coordinateUrl('/api/users')
    })
    .success($httpSuccessDebug(function(data) {
      defer.resolve(data);
    }))
    .error($httpErrorDebug(function(reason) {
      defer.reject(new Error('Unable to fetch user profile: ' + reason));
    }));

    return defer.promise;
  };


  this.login = function (username, password) {
    if(this.authenticated) {
      return $q.reject(new Error('User is already authenticated.'));
    }

    var
    lastAuth = this.lastCredentials;

    if((!username || !password) && lastAuth) { // use last authenticated by default
      username = lastAuth.username;
      password = lastAuth.password;
    }

    if(!username || !password) { // something is missing
      return $q.reject(new Error('Missing username and/or password.'));
    }

    var
    defer = $q.defer();

    $http({
      method: 'POST',
      url: $coordinateUrl('auth/local'),
      data: {
        email: username,
        password: password
      }
    })
    .success($httpSuccessDebug(function(data) {

      if(data.token) { // apply the valid token
        $storageAuth.setToken(data.token);
        $storageAuth.setCredentials(username, password);
        $rootScope.$emit('$apiAuthLogin');
      }

      defer.resolve(data);
    }))
    .error($httpErrorDebug(function(reason) {
      defer.reject('Could not log in: ' + reason);
    }));

    return defer.promise;
  };

  this.logout = function () {
    if(!this.authenticated) {
      return $q.reject(new Error('User is already logged out.'));
    }

    $storageAuth.clearToken();
    $storageAuth.clearCredentials();
    $rootScope.$emit('$apiAuthLogout');
    return $q.when(true);
  };
});