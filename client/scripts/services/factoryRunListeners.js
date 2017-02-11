/**
  * @class runListeners
  * @description Factory that sets up the database listeners. Firebase enables real-time updates any time database entries change, and the listeners in this factory get notified. The updated data is then routed to appropriate controllers (e.g. for rendering new user position on the map). 
  @returns {Object} Returns the factory object ('listener') with all methods to be used by controllers
*/
angular.module('myApp').factory('runListeners', function(databaseAndAuth, $rootScope, foursquare, coordinateCalc) {
  var listener = {};
  $rootScope.userCoordinates = [];
  /**
    * @function childChanged
    * @memberOf runListeners
    * @description Listens for updates in any single user data in the database (child_changed). On change, $rootscope broadcasts the event along with the snapshot of the new data that needs to be rendered or updated on the client's screen
  */
  listener.childChanged = function () {
    databaseAndAuth.database.ref('users').on('child_changed', function(snapshot) {
      //add the changed database item to our databaseAndAuth.users object
      //so it can be accessed accross all controllers 
      databaseAndAuth.users[snapshot.key] = snapshot.val();
      $rootScope.$broadcast('user:updatedOrAdded', [snapshot.key, snapshot.val()]);
    });
  };

  /**
    * @function childAdded
    * @memberOf runListeners
    * @description Listens for new user entries (e.g. when a new user sets up an account and gets added to the database). 
  */
  listener.childAdded = function () {
    databaseAndAuth.database.ref('users').on('child_added', function(snapshot) {
      databaseAndAuth.users[snapshot.key] = snapshot.val();
      $rootScope.$broadcast('user:updatedOrAdded', [snapshot.key, snapshot.val()]);

      // When a new user is added re-grab location data and update Foursquare search
        // Grab the location of all users on the map
        coordinateCalc.getUserLocationData().then(function(coordinates) {
          // Calculate center circle from users on the map
          var circleData = coordinateCalc.calculateCircle(coordinates);
          // Call foursquare with initialized search based on midpoint of users
          foursquare.getFoursquareData($rootScope.searchType, circleData);
        });
      
    });
  };
  /**
    * @function childRemoved
    * @memberOf runListeners
    * @description Listens for deletions (e.g. when user logs out and their coordinates are removed from the database)
  */
  listener.childRemoved = function () {
    databaseAndAuth.database.ref('users').on('child_removed', function(snapshot) {
      databaseAndAuth.users[snapshot.key] = snapshot.val();
      $rootScope.$broadcast('user:deleted', [snapshot.key, snapshot.val()]);
    });
  };
  return listener;
});