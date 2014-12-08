angular.module('angular-bootstrap-numberpicker', [])

.constant('numberpickerConfig', {
  defaultValue: 0,
  valueStep: 1,
})

.factory('NumberPickerSvc', function() {
  return {
  };
})

.controller('NumberpickerCtrl', ['$scope', function($scope) {
  this.init = function(ngModelCtrl) {
    this.ngModelCtrl = ngModelCtrl;
    
    console.log(ngModelCtrl.$modelValue);
    console.log(ngModelCtrl.$viewValue);
  };
  
  $scope.updateValue = function() {
    console.log($scope.pickerValue);
    console.log(this.ngModelCtrl.$modelValue);
//    console.log(Object.keys($scope));
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
