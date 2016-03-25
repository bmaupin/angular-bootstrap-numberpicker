angular.module("angularBootstrapNumberpicker", ["src/numberpicker.html", "angularBootstrapNumberpickerSource"]);

angular.module("src/numberpicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/numberpicker.html",
    "<style type=\"text/css\">\n" +
    "/* Hide the up/down arrows that Chrome adds to the number input\n" +
    "   http://stackoverflow.com/a/4298216/399105\n" +
    "*/\n" +
    "input::-webkit-outer-spin-button,\n" +
    "input::-webkit-inner-spin-button {\n" +
    "  -webkit-appearance: none;\n" +
    "  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */\n" +
    "}\n" +
    "</style>\n" +
    "<table>\n" +
    "	<tbody>\n" +
    "		<tr class=\"text-center\">\n" +
    "			<td><a ng-click=\"incrementValue()\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
    "		</tr>\n" +
    "		<tr name=\"myForm\" ng-form ng-class=\"{'has-error': myForm.value.$invalid}\">\n" +
    "			<td>\n" +
    "				<input type=\"number\" class=\"form-control\" name=\"value\" max=\"{{max}}\" min=\"{{min}}\" ng-model=\"value\" resizable-input>\n" +
    "			</td>\n" +
    "		</tr>\n" +
    "		<tr class=\"text-center\">\n" +
    "			<td><a ng-click=\"decrementValue()\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
    "		</tr>\n" +
    "	</tbody>\n" +
    "</table>\n" +
    "");
}]);

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
