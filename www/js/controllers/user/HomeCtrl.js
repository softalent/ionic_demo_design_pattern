angular.module('coordinate')
.config(function ($stateProvider) {
  $stateProvider
    .state('app.user.home', {
      url: '/home',
      templateUrl: 'templates/user/home.html',
      controller: 'HomeCtrl'
    });
})
.controller('HomeCtrl', function ($ionicLoading, $q, $scope, $clientWatch, $apiTasks, helper, $state, $interval, $compile) {
	$scope.navTitle = '<div class="header-logo"></div>';

  $scope.buckets = [];
  $scope.topTasks = [];
  $scope.loading = false;

  $interval(angular.noop, 10000); // to refresh countdowns

  function reloadTopTasks(client, num) {
    $scope.loading = 'Top Tasks';
    num = angular.isNumber(num) ? num : 3;
    return $apiTasks.getTopTasks(client, num, true)
      .then(function (tasks) {
        if(!angular.isArray(tasks)) {
          return false;
        }
        $scope.topTasks = tasks;
        return $scope.topTasks;
      });
  }

  function reloadBuckets(client) {
    $scope.loading = 'Task Buckets';
    return $apiTasks.getBuckets(client, true)
      .then(function (buckets) {
        $scope.buckets = buckets;
        return $scope.buckets;
      });
  }

  function cleanUp() {
  }

  function reload(client) {

    if(!client) {
      return cleanUp();
    }

    $scope.loading = 'Dashboard';

    return reloadTopTasks(client)
      .then(function () {
        return reloadBuckets(client);
      })
      .catch(function (err) {
        helper.showAlert(err);
      })
      .finally(function () {
        delete $scope.loading;
      });
  }

  $scope.$on('destroy', $scope.$watch('loading', function (loading) {
    if(loading) {
      return $ionicLoading.show({
        template: 'Loading ' + loading + '..'
      });
    }

    return $ionicLoading.hide();
  }));

  // install watcher and destroy when scope destroys
  $scope.$on('destroy', $clientWatch(reload));

  $scope.showTaskDetails = function(event)
  {
    if(event.target.id) {
      $state.go("app.user.bucket", {bucketId: event.target.id}, { location: 'replace' });
    }
  }
});