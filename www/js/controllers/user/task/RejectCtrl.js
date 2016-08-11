angular.module('coordinate')
.config(function ($stateProvider) {
  $stateProvider
    .state('app.user.task.reject', {
      url: '/reject',
      views: {
        'taskActionView': {
          templateUrl: 'templates/user/task/reject.html',
          controller: 'TaskRejectCtrl'
        },
        'taskActionButtons': {
          templateUrl: 'templates/user/task/reject-buttons.html',
          controller: 'TaskRejectButtonCtrl'
        }
      },
      resolve: {
        '$sharedData': [function () { return {}; }]
      }
    });
})
.controller('TaskRejectCtrl', function ($scope, $taskDetail, $sharedData) {
  $scope.rejectData = $sharedData;
})
.controller('TaskRejectButtonCtrl', function ($scope, $apiTasks, helper, $taskDetail, $sharedData) {
  $scope.rejectTask = function () {
    return $apiTasks.rejectTask($taskDetail, $sharedData.reason)
      .then(function (result) {
        console.log('got reject result:', result);
        return result;
      })
      .catch(function (err) {
        helper.showAlert(err);
        return err;
      });
  };
});