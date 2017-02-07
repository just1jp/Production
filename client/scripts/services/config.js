angular.module('myApp').config(function($routeProvider, $locationProvider, $httpProvider) {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAhV8qputTImKp3Z5DwwpUmT8lyNRktCfc",
    authDomain: "palfinder-6d55f.firebaseapp.com",
    databaseURL: "https://palfinder-6d55f.firebaseio.com",
    storageBucket: "palfinder-6d55f.appspot.com",
    messagingSenderId: "673459070337"
  };
  firebase.initializeApp(config);

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

  $routeProvider
  .when('/signup', {
            templateUrl: '../../partials/signup.html',
            controller: 'registerLogInLogOut'
  })
      .when('/profile', {
        templateUrl: '../../partials/profile.html',
        controller: 'privateMessages'
      })
    .when('/map', {
      templateUrl: '../../partials/map.html',
      controller: 'initializeMap'
  })
  .when('/', {
      templateUrl: '../../partials/login.html',
      controller: 'registerLogInLogOut',
  })

})
 .run(function($rootScope, $location, firebase) {

      if (localStorage.getItem('user')){
        console.log(localStorage.getItem('user'));
        $rootScope.loggedIn = true;
      }
    $rootScope.attemptSignup = false;
      window.checkLogin = function () {
        console.log('check login');
        console.log($rootScope.loggedIn);
        if ($rootScope.accessProfile === true) {
          console.log('accessing profile');
          $location.path('/profile');
        }
        else if ($rootScope.loggedIn === true) {
          console.log("logged in!");
          // no logged user, redirect to /login
          $location.path("/map");
        }
        else if ($rootScope.attemptSignup === true) {
          console.log('attempt signup');
          $location.path('/signup');
        }
        else {
          console.log('root');
          $location.path("/");
        }
      }
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      window.checkLogin();
      });
  });
