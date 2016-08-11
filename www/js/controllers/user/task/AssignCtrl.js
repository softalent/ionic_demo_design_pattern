angular.module('coordinate')
.config(function ($stateProvider) {
  $stateProvider
    .state('app.user.task.assign', {
      url: '/assign',
      views: {
        'taskActionView': {
          templateUrl: 'templates/user/task/assign.html',
          controller: 'TaskAssignCtrl'
        },
        'taskActionButtons': {
          templateUrl: 'templates/user/task/assign-buttons.html',
          controller: 'TaskAssignButtonCtrl'
        }
      },
      resolve: {
        '$sharedData': [function () { return {}; }]
      }
    });
})
.controller('TaskAssignCtrl', function ($scope, $clientWatch, $apiClient, $taskDetail, $sharedData) {

  $scope.assignData = $sharedData;

  $sharedData.user = (!!$taskDetail.assignTo ? ($taskDetail.assignTo._id||$taskDetail.assignTo) : false);
  $sharedData.email = $taskDetail.assignToEmail;
  $sharedData.due = !!$taskDetail.due ? new Date($taskDetail.due) : null;

  $scope.$on('destroy', $clientWatch(function (client) {
    if(!client) {
      delete $scope.users;
      return;
    }

    $apiClient.getClientUsers(client).then(function(users){
      $scope.users = users;
    });
  }));
})
.controller('TaskAssignButtonCtrl', function ($scope, $state, $ionicLoading, $apiTasks, helper, $taskDetail, $sharedData) {
  $scope.assignTask = function () {
    $ionicLoading.show();
    return $apiTasks.assignTask($taskDetail, $sharedData.user, $sharedData.email, $sharedData.due, $sharedData.reason)
      .then(function (result) {
        return $state.go('app.user.task', { taskId: $taskDetail._id }, { reload: true });
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