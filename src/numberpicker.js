angular.module('angularBootstrapNumberpicker', [])

.constant('numberpickerConfig', {
  defaultValue: 0,
  valueStep: 1,
})

.controller('NumberpickerCtrl', ['$scope', '$attrs', 'numberpickerConfig', function($scope, $attrs, numberpickerConfig) {
  if ('max' in $attrs) {
    $scope.max = $scope.$eval($attrs.max);
  }
  
  if ('min' in $attrs) {
    $scope.min = $scope.$eval($attrs.min);
  }
}])

.directive('numberpicker', ['numberpickerConfig', function(numberpickerConfig) {
  return {
    restrict: 'E',
    controller: 'NumberpickerCtrl',
    templateUrl: 'src/numberpicker.html',
    link: function(scope, element, attrs) {
      // Set variable defaults and allow them to be overridden in the DOM
      if ('defaultValue' in attrs) {
        scope.value = scope.$eval(attrs.defaultValue);
      } else {
        scope.value = numberpickerConfig.defaultValue;
      }
    }
  };
}]);
