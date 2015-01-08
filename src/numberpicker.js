angular.module('angularBootstrapNumberpicker', [])

.constant('numberpickerConfig', {
  defaultValue: 0,
  valueStep: 1,
})

.controller('NumberpickerCtrl', ['$scope', '$attrs', 'numberpickerConfig', function($scope, $attrs, numberpickerConfig) {
  // Set variable defaults and allow them to be overridden
  if (!angular.isDefined($scope.value)) {
    $scope.value = numberpickerConfig.defaultValue;
  }

  if ('max' in $attrs) {
    $scope.max = $scope.$eval($attrs.max);
  }
  
  if ('min' in $attrs) {
    $scope.min = $scope.$eval($attrs.min);
  }
}])

.directive('numberpicker', function() {
  return {
    restrict: 'E',
    controller: 'NumberpickerCtrl',
    templateUrl: 'src/numberpicker.html',
  };
});
