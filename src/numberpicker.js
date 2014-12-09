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
  ngModelCtrl = { $setViewValue: angular.noop }; // nullModelCtrl

  this.init = function(_ngModelCtrl) {
    ngModelCtrl = _ngModelCtrl;
  };
  
  $scope.updateValue = function() {
    ngModelCtrl.$setViewValue($scope.pickerValue);
  };
}])

.directive('numberpicker', function() {
  return {
    require: ['numberpicker', '?^ngModel'],
    controller:'NumberpickerCtrl',
    templateUrl: 'src/numberpicker.html',
    link: function(scope, element, attrs, ctrls) {
      var numberpickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (ngModelCtrl) {
        numberpickerCtrl.init(ngModelCtrl);
      }
    },
  };
});
