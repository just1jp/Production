/**
  * @class initializeMap
  * @description Controller for Google Maps. Makes use of databaseAndAuth factory in order to retrieve/update chat messages from the databse. Listens for any changes in $rootScope (broadcasted by services), and then takes in the new (broadcasted) data and applies it to $scope
*/

angular.module('myApp').controller('initializeMap', function($rootScope, $scope, $http, databaseAndAuth, coordinateCalc, foursquare, NgMap) {

  $rootScope.searchType = 'food';



  $scope.$on('user:updatedOrAdded', function(event, data) {
    $scope.userLocations[data[0]] = data[1];

    databaseAndAuth.database.ref('/foursquare_results').once('value').then(function(snapshot) {
      $scope.foursquareLocations = [];
      for (key in snapshot.val()) {
        $scope.foursquareLocations.push(snapshot.val()[key]);
      }
    });
    
    // console.log('foursquare array', $scope.foursquareLocations);
    // console.log('foursquare location latitude', $scope.foursquareLocations[0].venue.location.lat);
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

  //Grab new search circle data
  $scope.searchUpdate = function() {
    databaseAndAuth.database.ref('/search_radius').set({
      midpointLat: this.getCenter().lat(),
      midpointLon: this.getCenter().lng(),
      radius: this.getRadius()
    })
  }

  //Listen to updates to the search circle and update Foursquare results
  databaseAndAuth.database.ref('/search_radius').on('value', function(snapshot) {
    
    var latlon = snapshot.val().midpointLat + "," + snapshot.val().midpointLon;
    var radius = snapshot.val().radius;

    // Make a request to Foursquare with the circle coordinates and radius
    $http.get('/api/foursquare', 
    {
      params: {
        ll: latlon,
        radius: radius,
        llAcc: 20,
        limit: 10,
        section: $scope.searchType
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

  // returns name of clicked sidenav list item
  $scope.logName = function(name) {
    console.log('Venue.name is', name);
  }

  $scope.queryByType = function(type) {
    $scope.searchType = type;
    databaseAndAuth.database.ref('/search_radius').once('value').then(function(snapshot) {
      foursquare.getFoursquareData(type, {
        lat: snapshot.val().midpointLat,
        lng: snapshot.val().midpointLon,
        radius: snapshot.val().radius
      });
    });
  }

  NgMap.getMap().then(function(map) {

    var markers = [];
    var textOverlays = [];

    databaseAndAuth.database.ref('/foursquare_results').on('value', function(snapshot) {

      foursquareLocations = [];
      for (key in snapshot.val()) {
        foursquareLocations.push(snapshot.val()[key]);
      }

      // Adds a marker to the map and push to the array.
      function addMarker(lat, lng, name) {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: map,
          draggable: false,
          animation: google.maps.Animation.DROP,
          name: name
        });
        marker.addListener('click', deleteMarkers);
        markers.push(marker);

        var overlay = new CustomMarker(
          new google.maps.LatLng(lat, lng), 
          map,
          {
            marker_id: name,
            innerHTML: '<p class="location-label" ng-class="{ location_highlighted: $index == highlight.selected }">' + name + '</p>'
          }
        );
        textOverlays.push(overlay);

      }
      
      // Sets the map on all markers in the array.
      function setMapOnAll(map) {
        markers.forEach(marker => {marker.setMap(map);})
        textOverlays.forEach(overlay => {overlay.setMap(map);})
      }

      // Deletes all markers in the array by removing references to them.
      function deleteMarkers() {
        console.log('delete markers');
        setMapOnAll(null);
        markers = [];
        textOverlays = [];
      }

      // Clean the array of marker objects prior to adding to it
      deleteMarkers();

      // Add all foursquare locations to the markers array
      foursquareLocations.forEach(location => {
        addMarker(location.venue.location.lat, location.venue.location.lng, location.venue.name);
      })

    });

  });

  var clickLocation = function() {
    console.log(this.name);
    $scope.highlight = { selected: index };
  }

  // Recalculate the search coordinates for the map
  var updateCenterPointAndRadius = function() {
    coordinateCalc.getUserLocationData().then(function(coordinates) {
      circleData = coordinateCalc.calculateCircle(coordinates);
      
      $scope.avgLat = circleData.lat;
      $scope.avgLon = circleData.lng;
      $scope.radius = circleData.radius;

      databaseAndAuth.database.ref('/search_radius').set({
        midpointLat: circleData.lat,
        midpointLon: circleData.lng,
        radius: circleData.radius
      })
    })
  }

  //Render search circle once
  updateCenterPointAndRadius();

  // Create some new functionality for Google Maps Custom Markers
  function CustomMarker(latlng, map, args) {
    this.latlng = latlng; 
    this.args = args; 
    this.setMap(map); 
  }

  CustomMarker.prototype = new google.maps.OverlayView();

  CustomMarker.prototype.draw = function() {
    
    var self = this;
    
    var div = this.div;
    
    if (!div) {
    
      div = this.div = document.createElement('div');

      div.className = 'marker-label';
      div.style.position = 'absolute';
      div.style.cursor = 'pointer';
      
      if (typeof(self.args.innerHTML) !== 'undefined') {
        div.innerHTML = self.args.innerHTML;
      }

      if (typeof(self.args.marker_id) !== 'undefined') {
        div.dataset.marker_id = self.args.marker_id;
      }
      
      // Add an on click event to the name on the marker
      google.maps.event.addDomListener(div, "click", function(event) {      
        console.log(this.dataset.marker_id);
      });
      
      var panes = this.getPanes();
      panes.overlayImage.appendChild(div);
    }
    
    var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
    
    if (point) {
      div.style.left = (point.x + 15) + 'px';
      div.style.top = (point.y - 35) + 'px';
    }
  };

  CustomMarker.prototype.remove = function() {
    if (this.div) {
      this.div.parentNode.removeChild(this.div);
      this.div = null;
    } 
  };

  CustomMarker.prototype.getPosition = function() {
    return this.latlng; 
  };


  // Search for results by tab type (restaurant, coffee, drinks)
  $scope.queryByType = function(type) {
    console.log('i want to search for', type);
  };

  $scope.getLocInfo = function(location) {
    console.log('show me more info for', location)
  };


});