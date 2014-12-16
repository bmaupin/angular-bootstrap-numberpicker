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
  var _value = 0;
  
  $scope.value = function(newValue) {
    console.log($scope.myForm.value.$valid);
    return angular.isDefined(newValue) ? (_value = newValue) : _value;
  };
}])

.directive('numberpicker', function() {
  return {
    controller:'NumberpickerCtrl',
    templateUrl: 'src/numberpicker.html',
  };
});
