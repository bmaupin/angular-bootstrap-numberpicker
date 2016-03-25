angular.module('angularBootstrapNumberpickerSource', [])

.constant('numberpickerConfig', {
  defaultValue: 0,
  mousewheel: true,
  valueStep: 1,
})

.controller('NumberpickerCtrl', ['$scope', '$attrs', 'numberpickerConfig', function($scope, $attrs, numberpickerConfig) {
  // Set variable defaults and allow them to be overridden in DOM
  if ('defaultValue' in $attrs) {
    $scope.value = $scope.$eval($attrs.defaultValue);
  } else {
    $scope.value = numberpickerConfig.defaultValue;
  }
  
  this.mousewheel = numberpickerConfig.mousewheel;
  if ('mousewheel' in $attrs) {
    valueStep = $scope.$eval($attrs.mousewheel);
  }
  
  var valueStep = numberpickerConfig.valueStep;
  if ('valueStep' in $attrs) {
    valueStep = $scope.$eval($attrs.valueStep);
  }
  
  if ('max' in $attrs) {
    $scope.max = $scope.$eval($attrs.max);
  }
  
  if ('min' in $attrs) {
    $scope.min = $scope.$eval($attrs.min);
  }
  
  $scope.decrementValue = function() {
    if (angular.isDefined($scope.min) && $scope.value + valueStep < $scope.min) {
      $scope.value = $scope.min;
    } else if (angular.isDefined($scope.value)) {
      $scope.value -= valueStep;
    }
  };
  
  $scope.incrementValue = function() {
    if (angular.isDefined($scope.max) && $scope.value + valueStep > $scope.max) {
      $scope.value = $scope.max;
    } else if (angular.isDefined($scope.value)) {
      $scope.value += valueStep;
    }
  };
}])

.directive('numberpicker', function() {
  return {
    restrict: 'E',
    require: 'numberpicker',
    controller: 'NumberpickerCtrl',
    templateUrl: 'src/numberpicker.html',
    link: function(scope, element, attrs, ctrl) {
      // Respond on mousewheel spin
      if (ctrl.mousewheel) {
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
