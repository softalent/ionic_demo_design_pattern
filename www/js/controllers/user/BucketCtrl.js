angular.module('coordinate')
.config(function ($stateProvider) {
  $stateProvider
    .state('app.user.bucket', {
      url: '/bucket/:bucketId/:taskId',
      templateUrl: 'templates/user/bucket.html',
      controller: 'BucketCtrl',
      resolve: {
        '$bucketDetail': ['$stateParams', '$apiTasks', function ($stateParams, $apiTasks) {
            return $apiTasks.getBucketDetail($stateParams.bucketId);
        }],
        '$bucketTasks': ['$stateParams', '$apiTasks', function ($stateParams, $apiTasks) {
            return $apiTasks.getBucketTasks($stateParams.bucketId, true);
        }]
      },

      data: {
        loadingTemplate: 'Loading Bucket Details'
      }
    });
})
.controller('BucketCtrl', function ($scope, $stateParams, $bucketDetail, $bucketTasks) {

  $scope.navTitle = '<div class="header_title"><div class="header-logo"></div></div>';

  $scope.bucketDetail = $bucketDetail;
  $scope.bucketTasks = $bucketTasks;
  $scope.currentTask = null;

  var
  taskId = $stateParams.taskId||false;

  $scope.bucketTaskSelect = {
    index: false,
    loaded: null
  };

  if(taskId) {
    $bucketTasks.every(function (task, index) {
      if(task._id === taskId) {
        $scope.bucketTaskSelect.index = index;
        $scope.currentTask = task;
      }

      return $scope.bucketTaskSelect.index === false;
    });
  }
  else if($bucketTasks.length > 0) {
    $scope.bucketTaskSelect.index = 0;
  }

  $scope.$on('destroy', $scope.$watch('bucketTaskSelect.index', function (nv) {
    if(!angular.isNumber(nv)) return;
    $scope.bucketTaskSelect.loaded = $scope.currentTask = $bucketTasks[nv];
  }));
});