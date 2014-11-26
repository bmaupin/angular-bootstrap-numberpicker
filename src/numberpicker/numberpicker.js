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
  var selected = angular.isDefined($attrs.defaultValue) ? $scope.$parent.$eval($attrs.defaultValue) : numberpickerConfig.defaultValue,
      ngModelCtrl = { $setViewValue: angular.noop }; // nullModelCtrl

  this.init = function( ngModelCtrl_, inputs ) {
    ngModelCtrl = ngModelCtrl_;
    ngModelCtrl.$render = this.render;

    var valueInputEl = inputs.eq(0);

    var mousewheel = angular.isDefined($attrs.mousewheel) ? $scope.$parent.$eval($attrs.mousewheel) : numberpickerConfig.mousewheel;
    if ( mousewheel ) {
      this.setupMousewheelEvents( valueInputEl );
    }

    $scope.readonlyInput = angular.isDefined($attrs.readonlyInput) ? $scope.$parent.$eval($attrs.readonlyInput) : numberpickerConfig.readonlyInput;
    this.setupInputEvents( valueInputEl );
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
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  // Respond on mousewheel spin
  this.setupMousewheelEvents = function( valueInputEl ) {
    var isScrollingUp = function(e) {
      if (e.originalEvent) {
        e = e.originalEvent;
      }
      //pick correct delta variable depending on event
      var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
      return (e.detail || delta > 0);
    };

    valueInputEl.bind('mousewheel wheel', function(e) {
      $scope.$apply( (isScrollingUp(e)) ? $scope.incrementValue() : $scope.decrementValue() );
      e.preventDefault();
    });
  };

  this.setupInputEvents = function( valueInputEl ) {
    if ( $scope.readonlyInput ) {
      $scope.updateValue = angular.noop;
      return;
    }

    var invalidate = function(invalidValue) {
      ngModelCtrl.$setViewValue( null );
      ngModelCtrl.$setValidity('number', false);
      if (angular.isDefined(invalidValue)) {
        $scope.invalidValue = invalidValue;
      }
    };

    $scope.updateValue = function() {
      var pickerValue = isNumber($scope.pickerValue) ? parseInt($scope.
pickerValue, 10) : undefined;

      if ( angular.isDefined(pickerValue) ) {
        selected = pickerValue;
        refresh( 'm' );
      } else {
        invalidate(true);
      }
    };
    
    // Ensure we're within the extrema when editing the value with the keyboard
    valueInputEl.bind('blur', function(e) {
      if (!$scope.invalidValue) {
        $scope.$apply( function() {
          $scope.pickerValue = ensureExtrema($scope.pickerValue);
        });
      }
    });
  };

  this.render = function() {
    var number = ngModelCtrl.$modelValue ? ngModelCtrl.$modelValue : null;

    if ( isNaN(number) ) {
      ngModelCtrl.$setValidity('number', false);
      $log.error('Numberpicker directive: "ng-model" value must be a number.');
    } else {
      if ( number ) {
        selected = number;
      }
      refresh();
    }
  };

  // Call internally when we know that model is valid.
  function refresh( keyboardChange ) {
    makeValid();
    ngModelCtrl.$setViewValue( selected );
    $scope.pickerValue = selected;
  }

  function makeValid() {
    ngModelCtrl.$setValidity('number', true);
    $scope.invalidValue = false;
  }

  $scope.incrementValue = function() {
    selected += valueStep;
    selected = ensureExtrema(selected);
    refresh();
  };
  $scope.decrementValue = function() {
    selected -= valueStep;
    selected = ensureExtrema(selected);
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

      if ( ngModelCtrl ) {
        numberpickerCtrl.init( ngModelCtrl, element.find('input') );
      }
    }
  };
});
