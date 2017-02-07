//watch for current user location
angular.module('myApp').controller('watchCurrentUserLocation', function($rootScope, $scope, databaseAndAuth) {
  //when we get unique user id (upon login or page refresh with a user currently loged in)
  //we attach the unique id to scope, so later we can use to update the database when 
  //html5 geolocation successfuly finds the user location (see below)
  var success = function(response) {
    console.log('success! ', response.coords);
    databaseAndAuth.database.ref('users/' + $scope.userId + '/coordinates').update({
      latitude: response.coords.latitude,
      longitude: response.coords.longitude
    });
  };
  var error = function(item) {
    console.log('error! ', item);
  }
  //params for watchPosition
  var options = {
    enableHighAccuracy: true,
    timeout: 1,
    maximumAge: Infinity
  };
  
  $scope.$on('user:logIn', function(event, data) {
    $scope.userId = data; 
    navigator.geolocation.watchPosition(success, error, options);
  });
});