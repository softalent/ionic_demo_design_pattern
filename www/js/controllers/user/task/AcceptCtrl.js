angular.module('coordinate')
.config(function ($stateProvider) {
  $stateProvider
    .state('app.user.task.accept', {
      url: '/accept',
      views: {
        'taskActionView': {
          templateUrl: 'templates/user/task/accept.html',
          controller: 'TaskAcceptCtrl'
        },
        'taskActionButtons': {
          templateUrl: 'templates/user/task/accept-buttons.html',
          controller: 'TaskAcceptButtonCtrl'
        }
      },
      resolve: {
        '$sharedData': [function () { return {}; }]
      }
    });
})
.controller('TaskAcceptCtrl', function ($scope, $stateParams, $taskDetail, $sharedData) {
  $scope.acceptData = $sharedData;
})
.controller('TaskAcceptButtonCtrl', function ($scope, $apiTasks, helper, $taskDetail, $sharedData) {
  $scope.acceptTask = function () {
    return $apiTasks.acceptTask($taskDetail)
      .then(function (result) {
        console.log('got accept result:', result);
        return result;
      })
      .catch(function (err) {
        helper.showAlert(err);
        return err;
      });
  };
});