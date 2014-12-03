// Inject ourselves into ui.bootstrap
angular.module('ui.bootstrap', ['ui.bootstrap.numberpicker']);
angular.module('ui.bootstrap.numberpicker', [])

.constant('numberpickerConfig', {
  valueStep: 1,
  readonlyInput: false,
  mousewheel: true,
  defaultValue: 0,
  minValue: 0,
  maxValue: null
})

.controller('NumberpickerController', ['$scope', '$attrs', '$parse', '$log', '$locale', 'numberpickerConfig', function($scope, $attrs, $parse, $log, $locale, numberpickerConfig) {
  // variable where we can hold a new value and validate it before updating the view
  var newPickerValue = angular.isDefined($attrs.defaultValue) ? $scope.$parent.$eval($attrs.defaultValue) : numberpickerConfig.defaultValue,
      ngModelCtrl = { $setViewValue: angular.noop }; // nullModelCtrl

  this.init = function(ngModelCtrl_, element) {
    ngModelCtrl = ngModelCtrl_;

    var valueInputEl = element.find('input').eq(0);

    var mousewheel = angular.isDefined($attrs.mousewheel) ? $scope.$parent.$eval($attrs.mousewheel) : numberpickerConfig.mousewheel;
    if (mousewheel) {
      this.setupMousewheelEvents(valueInputEl);
    }

    $scope.readonlyInput = angular.isDefined($attrs.readonlyInput) ? $scope.$parent.$eval($attrs.readonlyInput) : numberpickerConfig.readonlyInput;
    this.setupInputEvents(valueInputEl);
    
    // Set the initial value of the input element
    refresh();
  };

  var valueStep = numberpickerConfig.valueStep;
  if ($attrs.valueStep) {
    $scope.$parent.$watch($parse($attrs.valueStep), function(stepValue) {
      valueStep = parseInt(stepValue, 10);
    });
  }
  
  var minValue = angular.isDefined($attrs.minValue) ? $scope.$parent.$eval($attrs.minValue) : numberpickerConfig.minValue;
  var maxValue = angular.isDefined($attrs.maxValue) ? $scope.$parent.$eval($attrs.maxValue) : numberpickerConfig.maxValue;
  if (minValue > maxValue) {
    $log.error('minValue is greater than maxValue');
  }

  function ensureExtrema(newValue) {
    if (minValue !== null && newValue < minValue) {
      return minValue;
    } else if (maxValue !== null && newValue > maxValue) {
      return maxValue;
    } else {
      return newValue;
    }
  }
  
  function isNumber(n) {
    return !isNaN(parseInt(n)) && isFinite(n);
  }

  // Respond on mousewheel spin
  this.setupMousewheelEvents = function(valueInputEl) {
    var isScrollingUp = function(e) {
      if (e.originalEvent) {
        e = e.originalEvent;
      }
      //pick correct delta variable depending on event
      var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
      return (e.detail || delta > 0);
    };

    valueInputEl.bind('mousewheel wheel', function(e) {
      $scope.$apply((isScrollingUp(e)) ? $scope.incrementValue() : $scope.decrementValue());
      e.preventDefault();
    });
  };

  this.setupInputEvents = function(valueInputEl) {
    if ($scope.readonlyInput) {
      $scope.updateValue = angular.noop;
      return;
    }
    
    $scope.updateValue = function() {
      // If the value is edited using the keyboard, visually indicate if it isn't a valid number
      if (!isNumber($scope.pickerValue)) {
        $scope.invalidValue = true;
      } else {
        $scope.invalidValue = false;
      }
    };
    
    // Wait until the input box loses focus to validate/update the value
    valueInputEl.bind('blur', function(e) {
      $scope.$apply(function() {
        // Only update the value if it's valid
        if (!$scope.invalidValue) {
          newPickerValue = ensureExtrema(parseInt($scope.pickerValue));
        }
        refresh();
      });
    });
  };

  // Call internally when we know that model is valid.
  function refresh() {
    $scope.invalidValue = false;
    // Update the model
    ngModelCtrl.$setViewValue(newPickerValue);
    // Update the template model
    $scope.pickerValue = newPickerValue;
  }

  $scope.incrementValue = function() {
    newPickerValue += valueStep;
    newPickerValue = ensureExtrema(newPickerValue);
    refresh();
  };
  $scope.decrementValue = function() {
    newPickerValue -= valueStep;
    newPickerValue = ensureExtrema(newPickerValue);
    refresh();
  };
}])

.directive('numberpicker', function () {
  return {
    restrict: 'EA',
    require: ['numberpicker', '?^ngModel'],
    controller:'NumberpickerController',
    replace: true,
    scope: {},
    templateUrl: 'template/numberpicker/numberpicker.html',
    link: function(scope, element, attrs, ctrls) {
      var numberpickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (ngModelCtrl) {
        numberpickerCtrl.init(ngModelCtrl, element);
      }
    }
  };
})

// Resize the input element based on its content
.directive('numberpickerInput', function () {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var elInput = element.find('input');
      var elSpan = element.find('span');
      elSpan.html(elInput.text());

      scope.$watch('pickerValue', function(pickerValue) {
        if(pickerValue) {
          elSpan.html(elInput.val());
          elInput.css('width', (elSpan[0].offsetWidth + 30) + 'px');
        }
      });
    },
  };
});
