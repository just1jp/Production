/**
  * @class autofocus
  * @description Directive that puts the focus into input fields (when user loads the page his/her cursor will be automatically placed inside an input field)
  */
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