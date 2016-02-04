var gamesRef = new Firebase("https://flickering-inferno-4436.firebaseio.com/games/");
var voteRef = gamesRef.child("-K9hE8L_Y2NAxvi8x06R").child('votes');
var mongoose = require('mongoose');
var Event = mongoose.model('Event');
var i = 0;
voteRef.on('child_changed', function(childSnapshot, prevChildKey) {
  var eventHandler = require('./index').eventHandler;
  i++;
  var currentVote = childSnapshot.val();
  var parentRef = voteRef.child(childSnapshot.key());
  console.log('votes logged', childSnapshot.numChildren()-1)
  console.log('expected numer of votes', currentVote.targets.length);
  var votes = {};

  Event.findById(parentRef.key()).exec()
  .then(function(currentEvent) {
    if (childSnapshot.numChildren()-1 === currentEvent.targets.length) {
      var parent;
      parentRef.once('value', function(parentSnap){
        parent = parentSnap.val()
      });
      // console.log(parent) 
      childSnapshot.forEach(function(snapshot) {
        var vote = snapshot.val();
        if(vote.choice){

          if (!votes[vote.choice]) {
            votes[vote.choice] = vote;
            votes[vote.choice].count = 1;
          } else {
            votes[vote.choice].count++;
          }
        }
      });
    }
    var winningVote = {max:0};
    Object.keys(votes).forEach(function(vote) {
        if (!winningVote.winner) winningVote = vote;
        else {
          if (winningVote.max < votes[vote]) {
            winningVote.winner = vote;
          }
        }
    });
    return votes[winningVote].willTrigger
  }).then(function(toTrigger) {
    return Event.findById(toTrigger).exec();
  }).then(function(eventToTrigger) {
    eventHandler[eventToTrigger.type](eventToTrigger);

  }).then(null, console.log);
});