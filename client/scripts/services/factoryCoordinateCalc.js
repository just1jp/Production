angular.module('myApp').factory('coordinateCalc', function($http, databaseAndAuth) {

  var factory = {};

  factory.getUserLocationData = function() {
    var ref = databaseAndAuth.database.ref('users');

    return ref.once('value')
      .then(snapshot => {

        var userLocations = [];

        snapshot.forEach(user => {
          var key = user.key;
          var userData = user.val();

          if ( userData.coordinates ) {
            userLocations.push(userData.coordinates);
          }
        });

        return userLocations;
      });
  }

  factory.calculateCircle = function(arr) {
    var totalLat = 0;
    var totalLon = 0;
    // Add minimum radius constraint if all users are clustered together
    var radius = 500;
    var denom = arr.length;

    arr.forEach(location => {
      totalLat += location.latitude;
      totalLon += location.longitude;
    });

    var avgLat = totalLat / denom;
    var avgLon = totalLon / denom;

    var latLon = [avgLat, avgLon];    

    arr.forEach(location => {

      // Calculate distance between two coordinates
      var lat1 = avgLat;
      var lon1 = avgLon;
      var lat2 = location.latitude;
      var lon2 = location.longitude;
      function deg2rad(deg) {
        return deg * (Math.PI/180)
      }
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1); 
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var distance = R * c * 1000; // Distance in m

      // Update radius to largest distance between points
      if (distance > radius) {
        radius = distance;
      }

    });

    var circleData = {
      'lat': avgLat,
      'lng': avgLon,
      'radius': radius
    }

    return circleData;
  }

  return factory;
});



