angular.module('angularBootstrapNumberpickerSource', [])

.constant('numberpickerConfig', {
  defaultValue: 0,
  mousewheel: true,
  valueStep: 1,
})

.controller('NumberpickerCtrl', ['$scope', '$attrs', 'numberpickerConfig', function($scope, $attrs, numberpickerConfig) {
  // Set variable defaults and allow them to be overridden
  // Order of preference is: 1. scope 2. DOM attributes 3. config constants
  if ('defaultValue' in $scope) {
    $scope.value = $scope.defaultValue;
  } else if ('defaultValue' in $attrs) {
    $scope.value = $scope.$eval($attrs.defaultValue);
  } else {
    $scope.value = numberpickerConfig.defaultValue;
  }
  
  if (!('mousewheel' in $scope)) {
    if ('mousewheel' in $attrs) {
      $scope.mousewheel = $scope.$eval($attrs.mousewheel);
    } else {
      $scope.mousewheel = numberpickerConfig.mousewheel;
    }
  }

  if (!('valueStep' in $scope)) {
    if ('valueStep' in $attrs) {
      $scope.valueStep = $scope.$eval($attrs.valueStep);
    } else {
      $scope.valueStep = numberpickerConfig.valueStep;
    }
  }
  
  // Don't set a default for min and max
  if ('max' in $attrs) {
    $scope.max = $scope.$eval($attrs.max);
  }
  
  if ('min' in $attrs) {
    $scope.min = $scope.$eval($attrs.min);
  }
  
  $scope.decrementValue = function() {
    if (angular.isDefined($scope.min) && $scope.value - $scope.valueStep < $scope.min) {
      $scope.value = $scope.min;
    } else if (angular.isDefined($scope.value)) {
      $scope.value -= $scope.valueStep;
    }
  };
  
  $scope.incrementValue = function() {
    if (angular.isDefined($scope.max) && $scope.value + $scope.valueStep > $scope.max) {
      $scope.value = $scope.max;
    } else if (angular.isDefined($scope.value)) {
      $scope.value += $scope.valueStep;
    }
  };
}])

.directive('numberpicker', function() {
  return {
    restrict: 'E',
    require: '?^ngModel',
    controller: 'NumberpickerCtrl',
    templateUrl: 'src/numberpicker.html',
    link: function(scope, element, attrs, ctrl) {
      // Respond on mousewheel spin
      if (scope.mousewheel) {
        var isScrollingUp = function(e) {
          if (e.originalEvent) {
            e = e.originalEvent;
          }
          //pick correct delta variable depending on event
          var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
          return (e.detail || delta > 0);
        };
        
        element.bind('mousewheel wheel', function(e) {
          scope.$apply((isScrollingUp(e)) ? scope.incrementValue() : scope.decrementValue());
          e.preventDefault();
        });
      }

      // Make ng-change work
      // http://stackoverflow.com/a/25973789/399105
      scope.$watch('myForm.value.$viewValue', function() {
        ctrl.$setViewValue(scope.value);
      });
    },
  };
})

// Resize the input element based on its content
.directive('resizableInput', function () {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var elSpan = angular.element('<span style="position:absolute;top:-9999px;"></span>');
      element.after(elSpan);
      
      scope.$watch('myForm.value.$viewValue', function(value) {
        if (value) {
          elSpan.html(value);
          element.css('width', (elSpan[0].offsetWidth + 30) + 'px');
        }
      });
    },
  };
});
