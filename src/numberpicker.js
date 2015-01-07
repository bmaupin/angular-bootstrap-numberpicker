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
  var _value;
  
  $scope.onBlur = function() {
    // Store the last valid value in a temporary variable
    if (angular.isDefined($scope.value)) {
      _value = $scope.value;
    // Roll back if the value becomes invalid
    } else {
      $scope.value = _value;
    }
    
    // If outside extrema on blur, set value to max/min
    if ('max' in $attrs) {
      max = $scope.$eval($attrs.max);
      if ($scope.value > max) {
        $scope.value = max;
        $scope.myForm.value.$setValidity('max', true);
      }
    }
    
    if ('min' in $attrs) {
      min = $scope.$eval($attrs.min);
      if ($scope.value < min) {
        $scope.value = min;
        $scope.myForm.value.$setValidity('min', true);
      }
    }
  };
  
  // Give a visual indicator if the value is outside extrema while editing it
  // directly
  $scope.onChange = function() {
/*  
    if ('max' in $attrs) {
      max = $scope.$eval($attrs.max);
      if ($scope.value > max) {
        $scope.myForm.value.$setValidity('max', false);
      } else {
        $scope.myForm.value.$setValidity('max', true);
      }
    }
    
    if ('min' in $attrs) {
      min = $scope.$eval($attrs.min);
      if ($scope.value < min) {
        $scope.myForm.value.$setValidity('min', false);
      } else {
        $scope.myForm.value.$setValidity('min', true);
      }
    }
    
*/    
  }
}])

.directive('numberpicker', function() {
  return {
    controller:'NumberpickerCtrl',
    templateUrl: 'src/numberpicker.html',
    require: ['numberpicker', '?^ngModel'],
    link: function(scope, elm, attrs, ctrls) {
      if ('max' in attrs) {
        var maxValidator = function(value) {
          max = scope.$eval(attrs.max);
          if (value > max) {
            scope.myForm.value.$setValidity('max', false);
            return undefined;
          } else {
            scope.myForm.value.$setValidity('max', true);
            return value;
          }
        };
      
        scope.myForm.value.$parsers.push(maxValidator);
//        scope.myForm.value.$formatters.push(maxValidator);
      }
    }
  };
});
