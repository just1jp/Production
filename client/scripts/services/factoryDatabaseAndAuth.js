angular.module('myApp').factory('databaseAndAuth', function($window, $geolocation, NgMap, $firebaseArray) {
  var factory = {};
  factory.users = {};
  factory.auth = firebase.auth();
  factory.database = firebase.database();
  return factory;
});