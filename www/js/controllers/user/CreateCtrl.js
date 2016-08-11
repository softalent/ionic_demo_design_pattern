angular.module('coordinate')
.config(function ($stateProvider) {
  $stateProvider
    .state('app.user.create', {
      url: '/create',
      templateUrl: 'templates/user/create.html',
      controller: 'CreateCtrl'
    });
})
.controller('CreateCtrl', function ($q, $scope, $state, $stateParams, $stateParams, $clientWatch, $apiTasks, $apiClient) {

  $scope.priorities = [
    ['high',     'High'],
    ['med-high', 'Medium High'],
    ['med-low',  'Medium Low'],
    ['low',      'Low']
  ];

  function reloadClientUsers(client) {
    return $apiClient.getClientUsers(client)
      .then(function (users) {
        $scope.users = users;
      });
  }

  function reloadClientOffices(client) {
    return $apiClient.getClientOffices(client)
      .then(function (offices) {
        $scope.offices = offices;
      });
  }

  function reloadClientBuckets(client) {
    return $apiTasks.getBuckets(client)
      .then(function (buckets) {
        $scope.buckets = buckets;
      });
  }

  function reload(client) {
    return $q.all([
      reloadClientUsers(client),
      reloadClientOffices(client),
      reloadClientBuckets(client)
    ]);
  }

  $scope.$on('destroy', $clientWatch(reload));
});