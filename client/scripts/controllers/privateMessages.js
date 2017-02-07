/**
  * @class privateMessages
  * @description Controller for that handles private messaging
*/
angular.module('myApp').controller('privateMessages', function($rootScope, $scope, $location) {
    /**
      * @class escapeEmailAddress
      * @description Creates an unique identifier for the database based on user email. The database does not allow keys with periods (.) so this function converts periods into commas. This allows us to find the user and update/delete their data (especially private messages) based on their email.
    */
    function escapeEmailAddress(email) {
        if (!email) return false

        // Replace '.' (not allowed in a Firebase key) with ',' (not allowed in an email address)
        email = email.toLowerCase();
        email = email.replace(/\./g, ',');
        return email;
    }

    /**
      * @class sendMessage
      * @description Sends the private message to the database using user email as the key (to populate appropriate user entry in the database). Note: period is replaced with a comma in the user email (see escapeEmailAddress in registerLoginLogout.js)
    */
    $scope.sendMessage = function (message, username) {
        message = $scope.message;
        username = $rootScope.userCredentials.email.slice(0, $rootScope.userCredentials.email.indexOf('@'));
        console.log(username);
        console.log($scope.target);
        var databaseKey = escapeEmailAddress($scope.target);
        firebase.database().ref().child('privateMessages/' + databaseKey).push({
            message: message,
            sender: username,
            createdAt: firebase.database.ServerValue.TIMESTAMP
        });
        console.log('sent message!');
        $scope.message = "";
        $scope.target = "";
    }
    /**
      * @class goHome
      * @description Routing functionality - sends the user back to the home page
    */
    $scope.goHome = function () {
        $rootScope.accessProfile = false;
        $location.path('/map');
    }
});