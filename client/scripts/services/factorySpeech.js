angular.module('myApp').factory('speech', function($http, $rootScope, $q) {

  if (!('webkitSpeechRecognition' in window)) {
      console.log('Speech API not supported here…');
  }
  else { //Let’s do some cool stuff :)
    var recognition = new webkitSpeechRecognition(); //That is the object that will manage our whole recognition process. 
    recognition.continuous = false;   //Suitable for dictation. 
    // recognition.interimResults = true;  //If we want to start receiving results even if they are not final.
    //Define some more additional parameters for the recognition:
    recognition.lang = "en-US"; 
    recognition.maxAlternatives = 1; //Since from our experience, the highest result is really the best...

    recognition.onstart = function() {
      console.log('onstart');
      //show user we're listening now
    };

    recognition.onend = function() {
      console.log('onend');
      //show user we're no longer listening
    };

    recognition.onresult = function(event) {
      if (typeof(event.results) === 'undefined')
      {
        recognition.stop();
        return;
      }

      for (var i = event.resultIndex; i < event.results.length; ++i) {      
        if (event.results[i].isFinal) { //Final results
          console.log("final results: " + event.results[i][0].transcript); 

          $rootScope.$broadcast('voice-event', {data: event.results[i][0].transcript});
        }
        // else {   //i.e. interim...
        //   console.log("interim results: " + event.results[i][0].transcript);  //You can use these results to give the user near real time experience.
        // } 
      }
    }; 
  }

  var factory = {};

  factory.record = function() {
    recognition.start();
  };

  return factory;
});