angular.module('myApp').factory('foursquare', function($http, databaseAndAuth) {

  var factory = {};


  factory.getUserLocationData = function() {
    var ref = databaseAndAuth.database.ref('users');

    ref.once('value')
      .then(snapshot => {

        var userLocations = [];

        snapshot.forEach(user => {
          var key = user.key;
          var userData = user.val();

          console.log('key: ', key);
          console.log('userData: ', userData.coordinates);

          userLocations.push(userData.coordinates);
        });

        console.log('all Data: ', userLocations);

        this.calculateMidpoint(userLocations);
      });
  }

  factory.calculateMidpoint = function(arr) {
    var totalLat = 0;
    var totalLon = 0;
    var denom = arr.length;

    arr.forEach(location => {
      totalLat += location.latitude;
      totalLon += location.longitude;
    });

    var avgLat = totalLat / denom;
    var avgLon = totalLon / denom;

    var latLon = [avgLat, avgLon];

    console.log('latLon: ', latLon);

    // this.calculateRadius(arr, latLon);
  }

  factory.calculateRadius = function(arr, midpoint) {

    


  }


  factory.getFoursquareData = function() {


    $http.get('/api/foursquare', 
    {
      params: {
        ll: "37.806515,-122.416934",
        radius: 250,
        llAcc: 20,
        limit: 10,
        section: 'food'
      }
    })
    .then( result => {
      var places = result.data.response.groups[0].items;
      
      places.forEach(place => {
        console.log(place.venue.name);
      });

    });
  };

  return factory;
});