angular.module('coordinate')

//
// Service for performing task queries
//
.service('$apiTasks', function ($http, $httpSuccessDebug, $httpErrorDebug, $q, $coordinateUrl) {

  this.normalizeId = function (t) {
    return !!t ? (t._id||t.id||t) : false;
  };

  this.getBucketDetail = function (bucketId) {
    var
    defer = $q.defer();

    $http({
      method: 'GET',
      url: $coordinateUrl('api/client-tasks',bucketId,'detail-bucket')
    })
    .success($httpSuccessDebug(defer.resolve.bind(defer)))
    .error($httpErrorDebug(function(reason) {
      defer.reject(new Error('Unable to load bucket details: ' + reason));
    }));

    return defer.promise;
  };

  this.getTaskDetail = function(taskId) {
    var
    defer = $q.defer();

    $http({
      method: 'GET',
      url: $coordinateUrl('api/client-tasks',taskId,'detail-task')
    })
    .success($httpSuccessDebug(defer.resolve.bind(defer)))
    .error($httpErrorDebug(function(reason) {
      defer.reject(new Error('Unable to load task details: ' + reason));
    }));

    return defer.promise;
  };

  this.getBucketTasks = function (bucketId, activeOnly) {
    var
    defer = $q.defer(),
    query = {};

    if(activeOnly) {
      query.filterBy = { returnActiveOnly: 1 };
    }

    $http({
      method: 'GET',
      url: $coordinateUrl('api/client-tasks',bucketId,'tasks'),
      params: query
    })
    .success($httpSuccessDebug(defer.resolve.bind(defer)))
    .error($httpErrorDebug(function(reason) {
      defer.reject(new Error('Unable to load tasks in bucket: ' + reason));
    }));

    return defer.promise;
  };

  this.getBuckets = function (clientId, activeTasksOnly) {
    var
    defer = $q.defer();

    $http({
      method: 'GET',
      url: $coordinateUrl('api/client-tasks',clientId,'collections'),
      params: { activeTasksOnly: !!activeTasksOnly ? 1 : 0 }
    })
    .success($httpSuccessDebug(defer.resolve.bind(defer)))
    .error($httpErrorDebug(function(reason) {
      defer.reject(new Error('Unable to load buckets: ' + reason));
    }));

    return defer.promise;
  };

  this.getTopTasks = function (clientId, number, activeOnly) {
    var
    defer = $q.defer();

    $http({
      method: 'GET',
      url: $coordinateUrl('api/client-tasks',clientId,'query-tasks'),
      params: { max: number||3, activeOnly: !!activeOnly ? 1 : 0 }
    })
    .success($httpSuccessDebug(defer.resolve.bind(defer)))
    .error($httpErrorDebug(function(reason) {
      defer.reject(new Error('Unable to load top tasks: ' + reason));
    }));

    return defer.promise;
  };

  this.createTask = function (clientId, spec) {

    var
    defer = $q.defer();

    console.log('create task:', arguments);

    $http({
      method: 'POST',
      url: $coordinateUrl('api/client-tasks',clientId,'create'),
      data: spec
    })
    .success($httpSuccessDebug(defer.resolve.bind(defer)))
    .error($httpErrorDebug(function(reason) {
      defer.reject(new Error('Unable to create task: ' + reason));
    }));

    return defer.promise;
  };

  this.acceptTask = function (task) {
    console.log('accept task:', arguments);
    return $q.reject(new Error('Task Accepting is Coming Soon'));
  };

  this.assignTask = function (task, user, email, due, comment) {

    var taskId = this.normalizeId(task);

    if(!taskId) {
      return $q.reject(new Error('Invalid task reference was provided to assign.'));
    }

    var
    defer = $q.defer();

    $http({
      method: 'POST',
      url: $coordinateUrl('api/client-tasks',taskId,'task-assign'),
      data: {
        user:    user,
        email:   email,
        due:     due,
        comment: comment
      }
    })
    .success($httpSuccessDebug(defer.resolve.bind(defer)))
    .error($httpErrorDebug(function(reason) {
      defer.reject(new Error('Unable to assign task: ' + reason));
    }));

    return defer.promise;
  };

  this.resolveTask = function (task, markClosed, reason) {

    var
    taskId = this.normalizeId(task);

    if(!taskId) {
      return $q.reject(new Error('Invalid task reference was provided to resolve.'));
    }

    var
    defer = $q.defer();

    $http({
      method: 'POST',
      url: $coordinateUrl('api/client-tasks',taskId,'task-resolve'),
      data: {
        markClosed: markClosed,
        message: reason
      }
    })
    .success($httpSuccessDebug(defer.resolve.bind(defer)))
    .error($httpErrorDebug(function(reason) {
      defer.reject(new Error('Unable to resolve task: ' + reason));
    }));

    return defer.promise;
  };

  this.rejectTask = function (task, reason) {

    var taskId = this.normalizeId(task);

    if(!taskId) {
      return $q.reject(new Error('Invalid task reference was provided to reject.'));
    }

    return $q.reject(new Error('Task Reject is Coming Soon'));

    // var
    // defer = $q.defer();

    // $http({
    //   method: 'POST',
    //   url: $coordinateUrl('api/client-tasks',taskId,'task-reject'),
    //   data: {
    //     message: reason
    //   }
    // })
    // .success($httpSuccessDebug(defer.resolve.bind(defer)))
    // .error($httpErrorDebug(function(reason) {
    //   defer.reject(new Error('Unable to reject task: ' + reason));
    // }));

    // return defer.promise;
  };
});