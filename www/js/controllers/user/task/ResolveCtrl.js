angular.module('coordinate')
.config(function ($stateProvider) {
  $stateProvider
    .state('app.user.task.resolve', {
      url: '/resolve',
      views: {
        'taskActionView': {
          templateUrl: 'templates/user/task/resolve.html',
          controller: 'TaskResolveCtrl'
        },
        'taskActionButtons': {
          templateUrl: 'templates/user/task/resolve-buttons.html',
          controller: 'TaskResolveButtonCtrl'
        }
      },
      resolve: {
        '$sharedData': [function () { return {}; }]
      }
    });
})
.controller('TaskResolveCtrl', function ($scope, $taskDetail, $sharedData) {
  $scope.resolveData = $sharedData;
})
.controller('TaskResolveButtonCtrl', function ($scope, $apiTasks, $ionicLoading, $state, helper, $taskDetail, $sharedData) {
  $scope.resolveTask = function (full) {
    $ionicLoading.show();
    return $apiTasks.resolveTask($taskDetail, !!full, $sharedData.note)
      .then(function (result) {
        // return $state.go('app.user.task', { taskId: $taskDetail._id });
        return $state.go('app.user.home', null, { reload: true });
      })
      .catch(function (err) {
        helper.showAlert(err);
        return err;
      })
      .finally(function () {
        $ionicLoading.hide();
      });
  };
});