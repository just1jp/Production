/**
  * @description Controller that grabs and displays places
*/
angular.module('myApp').controller('placesCtrl', function($rootScope, $scope, $location, foursquare) {
  console.log('in the places controller')

  $scope.places;

  $scope.getPlaces = function() {
    foursquare.getFoursquareData();
    console.log('in getPlaces function')
    // console.log('fs data', foursquare.getFoursquareData());
  }

  $scope.places = $scope.getPlaces();
  console.log('placesCtrl places', $scope.places)
});