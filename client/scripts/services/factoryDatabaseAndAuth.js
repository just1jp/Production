/**
  * @class databaseAndAuth
  * @description Factory that sets up local storage of users, connection with the database, and connection with the databse authentication methods. It also passess all the relevant dependencies into controllers. All controlers will have access to the db through this
  */
angular.module('myApp').factory('databaseAndAuth', function($window, $geolocation, NgMap, $firebaseArray) {
  var factory = {};
  factory.users = {};
  factory.auth = firebase.auth();
  factory.database = firebase.database();
  return factory;
});