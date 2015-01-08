angular.module('angularBootstrapNumberpicker', [])

.constant('numberpickerConfig', {
  defaultValue: 0,
  valueStep: 1,
})

.controller('NumberpickerCtrl', ['$scope', '$attrs', 'numberpickerConfig', function($scope, $attrs, numberpickerConfig) {
  // Set variable defaults and allow them to be overridden
  if ('defaultValue' in $attrs) {
    $scope.value = $scope.$eval($attrs.defaultValue);
  } else {
    $scope.value = numberpickerConfig.defaultValue;
  }
  
  var valueStep = numberpickerConfig.valueStep;
  if ('valueStep' in $attrs) {
    valueStep = $scope.$eval($attrs.valueStep);
  }
  
  if ('max' in $attrs) {
    $scope.max = $scope.$eval($attrs.max);
  }
  
  if ('min' in $attrs) {
    $scope.min = $scope.$eval($attrs.min);
  }
  
  $scope.decrementValue = function() {
    if (angular.isDefined($scope.min) && $scope.value + valueStep < $scope.min) {
      return;
    }
    if (angular.isDefined($scope.value)) {
      $scope.value -= valueStep;
    }
  }
  
  $scope.incrementValue = function() {
    if (angular.isDefined($scope.max) && $scope.value + valueStep > $scope.max) {
      return;
    }
    if (angular.isDefined($scope.value)) {
      $scope.value += valueStep;
    }
  }
}])

.directive('numberpicker', function() {
  return {
    restrict: 'E',
    controller: 'NumberpickerCtrl',
    templateUrl: 'src/numberpicker.html',
  };
});
