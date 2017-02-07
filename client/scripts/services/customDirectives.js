angular.module('myApp')
  .directive('autofocus', ['$timeout', function($timeout) { //enable text field autofocus when switching templates
    return {
      restrict: 'A',
      link : function($scope, $element) {
        $timeout(function() {
          $element[0].focus();
        });
      }
    }
  }]);