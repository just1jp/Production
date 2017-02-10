angular.module('myApp').factory('foursquare', function($http, databaseAndAuth, coordinateCalc) {

  var factory = {};

  factory.getFoursquareData = function() {

    // Grab the location of all users on the map
    coordinateCalc.getUserLocationData().then(function(coordinates) {

      // Calculate center circle from users on the map
      var circleData = coordinateCalc.calculateCircle(coordinates);

      var lat = circleData.midpointLat;
      var long = circleData.midpointLon;
      var radius = circleData.radius;
      var latlon = lat + "," + long;

      // Make a request to Foursquare with the circle coordinates and radius
      $http.get('/api/foursquare', 
      {
        params: {
          ll: latlon,
          radius: radius,
          llAcc: 20,
          limit: 10,
          section: 'food'
        }
      })
      .then( result => {
        var places = result.data.response.groups[0].items;
        var placeId = 0;

        places.forEach(place => {
          databaseAndAuth.database.ref('/foursquare_results').child('location' + placeId).set(place);
          placeId++;
        });

      });


    });

  };

  return factory;
});