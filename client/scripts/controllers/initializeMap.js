/**
  * @class initializeMap
  * @description Controller for Google Maps. Makes use of databaseAndAuth factory in order to retrieve/update chat messages from the databse. Listens for any changes in $rootScope (broadcasted by services), and then takes in the new (broadcasted) data and applies it to $scope
*/

angular.module('myApp').controller('initializeMap', function($rootScope, $scope, databaseAndAuth, coordinateCalc, foursquare, NgMap) {

  $scope.clickLocation = function(event, index) {
    $scope.highlight = { selected: index };
  }

  $scope.$on('user:updatedOrAdded', function(event, data) {
    $scope.userLocations[data[0]] = data[1];
    updateCenterPointAndRadius();

    databaseAndAuth.database.ref('/foursquare_results').once('value').then(function(snapshot) {
      $scope.foursquareLocations = [];
      for (key in snapshot.val()) {
        $scope.foursquareLocations.push(snapshot.val()[key]);
      }
    });
    
    // console.log('foursquare array', $scope.foursquareLocations);
    console.log('foursquare location latitude', $scope.foursquareLocations[0].venue.location.lat);
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

  // returns name of clicked sidenav list item
  $scope.logName = function(name) {
    console.log('Venue.name is', name);
  }

  $scope.queryByType = function(type) {
    foursquare.getFoursquareData(type);
  }

  NgMap.getMap().then(function(map) {
  });

  function renderLocationsonMap() {
    databaseAndAuth.database.ref('/foursquare_results').once('value').then(function(snapshot) {
      $scope.foursquareLocations = [];
      for (key in snapshot.val()) {
        $scope.foursquareLocations.push(snapshot.val()[key]);
      }
    });
  }

  function updateCenterPointAndRadius() {
    coordinateCalc.getUserLocationData().then(function(coordinates) {
      circleData = coordinateCalc.calculateCircle(coordinates);
      
      $scope.avgLat = circleData.midpointLat;
      $scope.avgLon = circleData.midpointLon;
      $scope.radius = circleData.radius;

      databaseAndAuth.database.ref('/search_radius').set({
        midpointLat: circleData.midpointLat,
        midpointLon: circleData.midpointLon,
        radius: circleData.radius
      })

      // renderLocationsonMap();

      console.log('LOCATIONS', $scope.foursquareLocations)
      console.log('updating search circle', $scope.avgLat, $scope.avgLon, $scope.radius);
    })
  }


});