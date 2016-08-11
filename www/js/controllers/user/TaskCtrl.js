angular.module('coordinate')
.config(function ($stateProvider) {
  $stateProvider
    .state('app.user.task', {
      url: '/task/:taskId',
      templateUrl: 'templates/user/task.html',
      controller: 'TaskCtrl',
      resolve: {
        '$taskDetail': ['$stateParams', '$apiTasks', function ($stateParams, $apiTasks) {
            return $apiTasks.getTaskDetail($stateParams.taskId);
        }]
      },
      data: {
        loadingTemplate: 'Loading Task Details'
      }
    });
})
.controller('TaskCtrl', function ($scope, $state, $stateParams, $stateParams, $taskDetail) {
  $scope.navTitle = '<div class="header-logo"></div>';
  $scope.task = $taskDetail;
  $scope.isTaskDefaultPage = true;

  // load a current state
  function initializeState(state) {
    $scope.isTaskDefaultPage = (state === 'app.user.task');
  }

  // monitor any state changes, reinitialize
  $scope.$on('destroy', $scope.$watch(function () {
    return $state.current.name
  }, initializeState));
})
.controller("CountdownController", function ($scope) {

  $scope.init = function(date)
  {
    $scope.date = date;
    
    if($scope.date) {
      var fullDate = new Date($scope.date);
    }
    
    $scope.timeTillEvent = {};

    var updateClock = function () {
      $scope.seconds = (fullDate - new Date()) / 1000;
      $scope.timeTillEvent = {
        daysLeft: parseInt($scope.seconds / 86400),
        hoursLeft: parseInt($scope.seconds % 86400 / 3600),
        minutesLeft: parseInt($scope.seconds % 86400 % 3600 / 60),
        secondsLeft: parseInt($scope.seconds % 86400 % 3600 % 60)
      }
    };

    setInterval(function () {
      $scope.$apply(updateClock);
    }, 1000);
    updateClock();

  };

})
.controller('PopupController', ['$scope', '$ionicModal',
  function ($scope, $ionicModal) {

    $ionicModal.fromTemplateUrl('templates/user/task/image-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.$on('modal.shown', function() {
      // Execute action
    });

    $scope.imageSrc = '../img/payomatic.png';

    $scope.showImage = function(index) {
      switch(index) {
        case 1:
          $scope.imageSrc = '../img/image1-full.jpg';
          break;
        case 2:
          $scope.imageSrc  = '../img/image2-full.jpg';
          break;
        case 3:
          $scope.imageSrc  = '../img/image3-full.jpg';
          break;
        case 4:
          $scope.imageSrc  = '../img/image4-full.jpg';
          break;
        case 5:
          $scope.imageSrc  = '../img/image5-full.jpg';
          break;
      }
      $scope.openModal();
    }
  }
]);