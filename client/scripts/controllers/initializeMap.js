/**
  * @class initializeMap
  * @description Controller for Google Maps. Makes use of databaseAndAuth factory in order to retrieve/update chat messages from the databse. Listens for any changes in $rootScope (broadcasted by services), and then takes in the new (broadcasted) data and applies it to $scope
*/

angular.module('myApp').controller('initializeMap', function($scope, databaseAndAuth, NgMap) {

  $scope.$on('user:updatedOrAdded', function(event, data) {
    $scope.userLocations[data[0]] = data[1];
    console.log('user location added or updated', data[1]);
    $scope.$apply();
  });

  $scope.$on('user:loggedOut', function(event, data) {
    $scope.userLocations = undefined; 
    $scope.$apply();
  });
  $scope.$on('user:logIn', function(event, data) {
    $scope.userLocations = databaseAndAuth.users;
    $scope.$apply();
  });

  NgMap.getMap().then(function(map) {
  });

});