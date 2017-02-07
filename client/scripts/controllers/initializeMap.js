angular.module('myApp').controller('initializeMap', function($scope, databaseAndAuth, NgMap) {
  //set scope to userinfo provided by databaseAndAuth

  
  //listen for any changes in user location (executed in app.run above)
  $scope.$on('user:updatedOrAdded', function(event, data) {
    //apply the change only to the user that was updated/added/removed
    $scope.userLocations[data[0]] = data[1];
    console.log('user location added or updated', data[1]);
    //apply the change so map markers can be updated
    $scope.$apply();
  });

  //on logout remove all map markers
  $scope.$on('user:loggedOut', function(event, data) {
    $scope.userLocations = undefined; 
    $scope.$apply();
  });
  //on login repopulate all map markers
  $scope.$on('user:logIn', function(event, data) {
    $scope.userLocations = databaseAndAuth.users;
    $scope.$apply();
  });

  NgMap.getMap().then(function(map) {
  });

});