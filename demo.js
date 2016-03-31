angular.module('numberpicker-demo', ['angularBootstrapNumberpickerSource'])
  .controller('NumberpickerDemoCtrl', function ($scope, $log) {
    $scope.defaultValue = 5;
    $scope.min = 0;

    $scope.valueChanged = function() {
      $log.log('Value changed=' + $scope.numberValue);
    };
  });
