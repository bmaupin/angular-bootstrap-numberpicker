angular.module('angular-bootstrap-numberpicker', [])

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
}])

.directive('numberpicker', function() {
  return {
    controller:'NumberpickerCtrl',
    templateUrl: 'src/numberpicker.html',
  };
});
