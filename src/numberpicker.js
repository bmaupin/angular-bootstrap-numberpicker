angular.module('angularBootstrapNumberpicker', [])

.constant('numberpickerConfig', {
  defaultValue: 0,
  valueStep: 1,
})
/*
.factory('NumberPickerSvc', function() {
  return {
  };
})
*/
.controller('NumberpickerCtrl', ['$scope', function($scope) {
  var _value;
  
  $scope.onBlur = function() {
    // Store the last valid value in a temporary variable
    if (angular.isDefined($scope.value)) {
      _value = $scope.value;
    // Roll back if the value becomes invalid
    } else {
      $scope.value = _value;
    }
  };
}])

.directive('numberpicker', function() {
  return {
    controller:'NumberpickerCtrl',
    templateUrl: 'src/numberpicker.html',
  };
});
