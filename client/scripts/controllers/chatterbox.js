angular.module('myApp').controller('chatterboxCtrl', function($scope, $rootScope, $location, databaseAndAuth) {
  console.log('inside chatterboxCtrl');

  var database = firebase.database();

  $scope.messageObj = {};
  
  $scope.sendMessage = function(userId, text) {
    var chatEmail = databaseAndAuth.auth.currentUser.email;
    var chatUsername = chatEmail.slice(0, chatEmail.indexOf('@'));
    
    var chatId = +new Date(Date()); //use time in milliseconds for chatId

    database.ref('chats/' + chatId).set({
      username: chatUsername,
      text: $scope.text,
      createdAt: Date()
    });

    $scope.text = '';
  };

  $scope.fetchMessage = function() {
    
    var ref = database.ref('chats');
    
    ref.limitToLast(9).on('value', function(chat) {
      $scope.messageObj = chat.val();
      $scope.$apply();
    });

  };

  $scope.hidePartial = function() {
    $rootScope.showMessages = false;
  }

});