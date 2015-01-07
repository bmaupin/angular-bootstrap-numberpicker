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
.controller('NumberpickerCtrl', ['$scope', '$attrs', function($scope, $attrs) {
  if ('max' in $attrs) {
    $scope.max = $scope.$eval($attrs.max);
  }
  
  if ('min' in $attrs) {
    $scope.min = $scope.$eval($attrs.min);
  }
}])

.directive('numberpicker', function() {
  return {
    controller:'NumberpickerCtrl',
    templateUrl: 'src/numberpicker.html',
  };
});
