 /**
  * @class angular_module.myApp
  @description Main application module. All services, controllers, and config files are subordinate to this module.  
  */
  angular.module('myApp', ['ngMaterial', 'ngRoute', 'firebase', 'ngGeolocation', 'ngMap'])
    .config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
      .primaryPalette('indigo', {
        'default': '500',
        'hue-1': '50',
        'hue-2': '100',
        'hue-3': '300'
      }) 
      .accentPalette('blue-grey');
    });