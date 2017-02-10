/**
  * @class initializeMap
  * @description Controller for Google Maps. Makes use of databaseAndAuth factory in order to retrieve/update chat messages from the databse. Listens for any changes in $rootScope (broadcasted by services), and then takes in the new (broadcasted) data and applies it to $scope
*/

angular.module('myApp').controller('initializeMap', function($rootScope, $scope, databaseAndAuth, coordinateCalc, NgMap) {

  $scope.$on('user:updatedOrAdded', function(event, data) {
    $scope.userLocations[data[0]] = data[1];
    updateCenterPointAndRadius();
<<<<<<< HEAD

    databaseAndAuth.database.ref('/foursquare_results').once('value').then(function(snapshot) {
      $scope.foursquareLocations = [];
      for (key in snapshot.val()) {
        $scope.foursquareLocations.push(snapshot.val()[key]);
      }
    });
    
    console.log('foursquare array', $scope.foursquareLocations);
    console.log('foursquare location latitude', $scope.foursquareLocations[0].venue.location.lat);
=======
>>>>>>> 321d383a843919cb26f18cb8c517e4b6416b6b80
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

<<<<<<< HEAD
  function renderLocationsonMap() {
    databaseAndAuth.database.ref('/foursquare_results').once('value').then(function(snapshot) {
      $scope.foursquareLocations = [];
      for (key in snapshot.val()) {
        $scope.foursquareLocations.push(snapshot.val()[key]);
      }
    });
  }

=======
>>>>>>> 321d383a843919cb26f18cb8c517e4b6416b6b80
  function updateCenterPointAndRadius() {
    coordinateCalc.getUserLocationData().then(function(coordinates) {
      circleData = coordinateCalc.calculateCircle(coordinates);
      
      $scope.avgLat = circleData.midpointLat;
      $scope.avgLon = circleData.midpointLon;
      $scope.radius = circleData.radius;
<<<<<<< HEAD

      databaseAndAuth.database.ref('/search_radius').set({
        midpointLat: circleData.midpointLat,
        midpointLon: circleData.midpointLon,
        radius: circleData.radius
      })

      // renderLocationsonMap();

=======
>>>>>>> 321d383a843919cb26f18cb8c517e4b6416b6b80
      console.log('updating search circle', $scope.avgLat, $scope.avgLon, $scope.radius);
    })
  }


});
























