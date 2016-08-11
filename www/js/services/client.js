angular.module('coordinate')

//
// Service for storing current selected client.
//
.service('$storageClient', function ($rootScope, $storage) {
  var
  LS_CLIENT = 'coordinateClient';

  Object.defineProperties(this, {
    current: {
      get: function () {
        return this.getCurrent();
      }
    }
  });

  this.clearCurrent = function () {
    $storage.unset(LS_CLIENT);
    return this;
  };

  this.setCurrent = function (client) {
    var
    previous = this.current,
    current = this.normalizeId(client)||null;
    $storage.set(LS_CLIENT, current);
    $rootScope.$emit('$storageClientChangeClient', current, previous);
    return this;
  };

  this.getCurrent = function () {
    return $storage.get(LS_CLIENT);
  };

  this.normalizeId = function (client) {
    if(client && !angular.isString(client)) {
      client = String(client._id||client.id||client);
    }

    return client || false;
  };
})

//
// Watcher utility function for client change events.
// Triggers also when authentication changes
//
.service('$clientWatch', function ($rootScope, $storageClient, $authWatch) {
  return function (cb) {
    var
    kcbOnChange = angular.noop,
    kcbOnAuth   = angular.noop,
    notifyCb = function (current, previous) {
      cb.call($storageClient, current, previous);
    };

    if(angular.isFunction(cb)) {
      kcbOnChange = $rootScope.$on('$storageClientChangeClient', function (event, current, previous) {
        notifyCb(current, previous);
      });

      kcbOnAuth = $authWatch(function (authenticated) { // on login
        notifyCb(authenticated ? $storageClient.current : null, null);
      });
    }

    return function () { // kill watchers callback
      kcbOnChange();
      kcbOnAuth();
    };
  };
})

//
// Service for clients
//
.service('$apiClient', function ($q, $http, $httpSuccessDebug, $httpErrorDebug, $coordinateUrl, $storageClient, $authWatch) {

  var
  loaded = [];

  Object.defineProperties(this, {
    current: {
      get: function () {
        return this.getCurrent();
      }
    },
    length: {
      get: function () {
        return loaded.length;
      }
    },
    available: {
      get: function () {
        return loaded;
      }
    }
  });

  this.clearCurrent = $storageClient.clearCurrent.bind($storageClient);
  this.setCurrent   = $storageClient.setCurrent.bind($storageClient);
  this.getCurrent   = $storageClient.getCurrent.bind($storageClient);

  this.clearAvailable = function () {
    loaded.splice(0, loaded.length);
    return this;
  };

  this.getClients = function () {

    var
    defer = $q.defer();

    $http({
      method: 'GET',
      url: $coordinateUrl('api/clients')
    })
    .success($httpSuccessDebug(defer.resolve.bind(defer)))
    .error($httpErrorDebug(function (reason) {
      defer.reject(new Error('Unable to load available clients: ' + reason));
    }));

    return defer.promise;
  };

  this.getClientUsers = function (client) {
    client = $storageClient.normalizeId(client||this.current);

    var defer = $q.defer();

    $http({
      method: 'GET',
      url: $coordinateUrl('api/client-users',client)
    })
    .success($httpSuccessDebug(defer.resolve.bind(defer)))
    .error($httpErrorDebug(function (reason) {
      defer.reject(new Error('Unable to load client users: ' + reason));
    }));

    return defer.promise;
  };

  this.getClientAbilities = function (client) {
    client = $storageClient.normalizeId(client||this.current);

    var defer = $q.defer();

    $http({
      method: 'GET',
      url: $coordinateUrl('api/clients',client,'abilities')
    })
    .success($httpSuccessDebug(defer.resolve.bind(defer)))
    .error($httpErrorDebug(function (reason) {
      defer.reject(new Error('Unable to load client abilities: ' + reason));
    }));

    return defer.promise;
  };

  this.getClientSettings = function (client) {
    client = $storageClient.normalizeId(client||this.current);

    var defer = $q.defer();

    $http({
      method: 'GET',
      url: $coordinateUrl('api/client-settings',client)
    })
    .success($httpSuccessDebug(defer.resolve.bind(defer)))
    .error($httpErrorDebug(function (reason) {
      defer.reject(new Error('Unable to load client settings: ' + reason));
    }));

    return defer.promise;
  };

  this.getClientRegions = function (client) {
    client = $storageClient.normalizeId(client||this.current);

    var defer = $q.defer();

    $http({
      method: 'GET',
      url: $coordinateUrl('/api/client-regions',client)
    })
    .success($httpSuccessDebug(defer.resolve.bind(defer)))
    .error($httpErrorDebug(function (reason) {
      defer.reject(new Error('Unable to load client regions: ' + reason));
    }));

    return defer.promise;
  };

  this.getClientOffices = function (client) {
    client = $storageClient.normalizeId(client||this.current);

    var defer = $q.defer();

    $http({
      method: 'GET',
      url: $coordinateUrl('/api/client-offices',client)
    })
    .success($httpSuccessDebug(defer.resolve.bind(defer)))
    .error($httpErrorDebug(function (reason) {
      defer.reject(new Error('Unable to load client offices: ' + reason));
    }));

    return defer.promise;
  };

  this.getClientCampaigns = function (client) {
    client = $storageClient.normalizeId(client||this.current);

    var defer = $q.defer();

    $http({
      method: 'GET',
      url: $coordinateUrl('/api/client-campaigns',client)
    })
    .success($httpSuccessDebug(defer.resolve.bind(defer)))
    .error($httpErrorDebug(function (reason) {
      defer.reject(new Error('Unable to load client campaigns: ' + reason));
    }));

    return defer.promise;
  };

  this.getClientManagers = function (client) {
    client = $storageClient.normalizeId(client||this.current);

    var defer = $q.defer();

    $http({
      method: 'GET',
      url: $coordinateUrl('/api/client-managers',client)
    })
    .success($httpSuccessDebug(defer.resolve.bind(defer)))
    .error($httpErrorDebug(function (reason) {
      defer.reject(new Error('Unable to load client managers: ' + reason));
    }));

    return defer.promise;
  };

  this.isAvailableClient = function (client) {
    if(!client) {
      return false;
    }

    var id = $storageClient.normalizeId(client);

    return !loaded.every(function (lc) {
      return $storageClient.normalizeId(lc) !== id;
    });
  };

  this.reloadAvailable = function () {
    return this.clearAvailable()
      .getClients()
      .then((function (clients) {
        Array.prototype.push.apply(loaded, clients);

        var current = this.current;

        // ensure current exists in this list, otherwise clear it.
        if(current && !this.isAvailableClient(current)) {
          this.clearCurrent();
          current = null;
        }

        if(!current && this.length > 0) {
          this.setCurrent(loaded[0]); // pick first client (by default)
          current = this.current;
        }

        return loaded;
      }).bind(this));
  };

  // install an authentication watcher for this service
  $authWatch((function (authenticated) {
    if(authenticated) {
      this.reloadAvailable()
        .catch(function (err) {
          console.error('Had a problem loading available clients', err);
        });
    }
    else {
      this.clearAvailable();
      this.clearCurrent(); // possibly not?
    }
  }).bind(this));
})
.run(function ($apiClient) { // this NEEDS to be run from somewhere.
});