/**
  * @class config
  * @description Configuration file that sets up the connection with the Firebase database. It also sets up angular router.
  */
angular.module('myApp').config(function($routeProvider, $locationProvider, $httpProvider, keysProvider) {
  // Initialize Firebase

  firebase.initializeApp(keysProvider.$get().config);

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  /**
    * @class routeProvider
    * @description Angular router
    */
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
      templateUrl: '../../partials/map.html'
    })
    .when('/', {
      templateUrl: '../../partials/login.html',
      controller: 'registerLogInLogOut',
    })

})
/**
  * @class run (anonymous function)
  * @description Does not allow non-logged in users to see restricted pages
  */
 .run(function($rootScope, $location, firebase) {
      /**
        * @class checkUserStatus
        * @description Storing user status in local storage. Speeds up the routing process because the app knows instantly if user is logged in or not (doesn't have to consult database every time)
        */
      if (localStorage.getItem('user')){
        $rootScope.loggedIn = true;
      }
      /**
        * @class $rootScope.attemptSignup 
        * @description variable that determines if user clicked on "signup" button
      */
    $rootScope.attemptSignup = false;
      /**
        * @class window.checkLogin
        * @description Determines which page the user is allowed to see based on their login status (logged in or not). Sets an inital variable on the global 'window' object. This way the app knows if user is logged in or not, and based on that routes them to the appropriate web page. $location.path sets the url to the desired web page - built in angular method to route the client to a web page. See Angular docs for more information about $location: https://docs.angularjs.org/api/ng/service/$location
      */
      window.checkLogin = function () {
        console.log('check login ', $rootScope.loggedIn);
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
