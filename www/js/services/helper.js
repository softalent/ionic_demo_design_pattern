angular.module('coordinate')
.filter('countdown', function () {
  return function(due_date_string, now){
    now = now||new Date();
    due = new Date(due_date_string);
    if (due > now) {
      diff = "";
      timeDiff = Math.floor((due.getTime() - now.getTime()) / 1000);
      /*
      s = timeDiff % 60;
      if (s > 0){
        diff = s + "s";
      }
      */
      timeDiff = Math.ceil(timeDiff / 60);
      m = timeDiff % 60;
      if (m > 0){
        diff = m + "m " + diff;
      }
      timeDiff = Math.floor(timeDiff / 60);
      h = timeDiff % 24;
      if (h > 0){
        diff = h + "h " + diff;
      }
      d = Math.floor(timeDiff / 24);
      if (d > 0){
        diff = d + "d " + diff;
      }
      if (diff == ""){
        diff = "0s";
      }
    } else {
      diff = "Already due";
    }

    return diff;
  };
})
.service('$httpSuccessDebug', function ($log, DEBUGGING) {
  return function (cb) {
    return function (data, status, headers, opts) {

      if(DEBUGGING) {
        var
        output = ['HTTP SUCCESS'];

        if(angular.isNumber(status)) {
          output.push('(#' + status + ')');
        }
        if(angular.isObject(opts)) {
          output.push('[' + opts.method + ' '+ opts.url + ']');

          if(opts.data) {
            output.push(JSON.stringify(opts.data));
          }
        }
        if(data) {
          output.push('>> ' + JSON.stringify(data));
        }
        else {
          output.push('no response received');
        }

        $log.debug(output.join(' '));
      }

      if(angular.isFunction(cb)) {
        cb.call(this, data, status, headers, opts);
      }
    };
  };
})
.service('$httpErrorDebug', function ($log, DEBUGGING) {
  return function (cb, defaultReason) {
    return function (data, status, headers, opts) {
      var
      output = ['HTTP ERROR'],
      reason = defaultReason||'Unspecified server error';

      if(angular.isNumber(status)) {
        output.push('(#' + status + ')');
      }
      if(angular.isObject(opts)) {
        output.push('[' + opts.method + ' '+ opts.url + ']');

        if(opts.data) {
          output.push(JSON.stringify(opts.data));
        }
      }
      if(data) {
        if(DEBUGGING) {
          output.push('>> ' + JSON.stringify(data));
        }

        if(data.message) {
          reason = data.message;
        }
      }
      else {
        output.push('no response received');
      }

      $log.error(output.join(' '));

      if(angular.isFunction(cb)) {
        cb.call(this, reason, data, status, headers, opts);
      }
    };
  };
})
.service('helper', function ($http, $q, $ionicPopup) {
  return {
    // An alert dialog
    showAlert: function(msg) {
         var alertPopup = $ionicPopup.alert({
           title: 'Coordinate Mobile',
           template: msg
         });

         alertPopup.then(function(res) {});
    },
    // A confirm dialog
    showConfirm: function(msg) {
       var confirmPopup = $ionicPopup.confirm({
         title: 'Coordinate Mobile',
         template: msg
       });

       var defer = $q.defer();

       confirmPopup.then(function(res) {
         if(res) {
           defer.resolve(res);
         } else {
           defer.reject(res);
         }
       });

       return defer.promise;
    }
  };
})
.factory('authInterceptor', function ($rootScope, $q, $location, $storageAuth) {
  return {

    // Add authorization token to headers if authenticated
    request: function (config) {
      config.headers = config.headers || {};

      if ($storageAuth.authenticated) {
        config.headers.Authorization = 'Bearer ' + $storageAuth.token;
      }

      return config;
    },

    // Intercept 401s and redirect you to login (should re-attempt login if previously stored credentials)
    responseError: function(response) {
      if(response.status === 401) {
        $storageAuth.clearToken(true); // clear and save auth storage (don't clear credentials)

        // var
        // credentials = $storageAuth.getCredentials();

        //
        // TODO: Implement a method to re-validate the token and retry the attempted request.
        //

        $location.path('/login').replace(); // use $location instead of $state ot prevent circ dep

        return $q.reject(response);
      }
      else {
        return $q.reject(response);
      }
    }
  };
});