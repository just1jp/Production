/**
  * @class chatterboxCtrl
  * @description Controller for chat. Makes use of databaseAndAuth factory in order to retrieve/update chat messages from the databse.
*/
angular.module('myApp').controller('chatterboxCtrl', function($scope, $rootScope, $location, $mdBottomSheet, databaseAndAuth, foursquare, speech) {

  var database = firebase.database();

  $scope.messageObj = {};
  /**
    * @function sendMessage
    * @memberOf chatterboxCtrl
    * @description Gets the user email and username from the database. Takes user input ($scope.text) and updates the database with that input. Each input is added to the user that submitted it.
  */
  $scope.sendMessage = function(userId, text) {
    console.log('sendMessage function')
    var chatEmail = databaseAndAuth.auth.currentUser.email;
    var chatUsername = chatEmail.slice(0, chatEmail.indexOf('@'));
    
    var chatId = +new Date(Date()); //use time in milliseconds for chatId

    database.ref('chats/' + chatId).set({
      username: chatUsername,
      text: $scope.text,
      createdAt: Date()
    });
    console.log('')
    $scope.text = '';
  };
  /**
    * @function fetchMessage
    * @memberOf chatterboxCtrl
    * @description Gets all the chats from the database, attaches them to the scope, and then renders the updated scope ($scope.apply())
  */
  $scope.fetchMessage = function() {
    console.log('in fetchMessage')
    
    var ref = database.ref('chats');
    
    ref.limitToLast(9).on('value', function(chat) {
      $scope.messageObj = chat.val();
      console.log('messageObj', $scope.messageObj)
      $scope.$apply();
    });
    $scope.showMessages = true;
  };

  $scope.showChat = function() {
    console.log('in showChat function')

    $mdBottomSheet.show({
      templateUrl: 'chat-template.html',
      controller: 'chatterboxCtrl'
    });
  }

  $scope.record = function() {
    speech.record();
  }

  $scope.$on('voice-event', (event, args) => {
    console.log('voice-event: ', args.data);
    $scope.text = args.data;
    $scope.$apply();
  });


});