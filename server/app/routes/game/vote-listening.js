var voteRef = new Firebase("https://flickering-inferno-4436.firebaseio.com/K9cpfp9AxxsXHgEgFl_/votes");
var mongoose = require('mongoose');
var Event = mongoose.model('Event');
var i = 0;
voteRef.on('child_added', function(childSnapshot, prevChildKey) {

  var eventHandler = require('./index').eventHandler;
  // // array of obj --> [{choice: ..., willTrigger: ...}]
  i++;
  var currentVote = childSnapshot.val();
  // // console.log(currentVote)
  var parent = voteRef.child(childSnapshot.key());

  var eventId = "56b0ec617990997c9e970374"
  // var parentKeys = Object.keys(parent);
  var votes = {};
  Event.findById(eventId).exec()
  .then(function(currentEvent) {
    if (childSnapshot.numChildren() === currentEvent.targets.length) {
      childSnapshot.forEach(function(vote) {
        var choice = parent.vote.choice;
        if (!votes[choice]) {
          votes[choice] = 1;
        } else {
          votes[choice] = votes[choice]++;
        }
      });
    }
    var winningVote;
    Object.keys(votes).forEach(function(vote) {
      if (!winningVote) winningVote = votes.vote;
      else {
        if (winningVote < votes.vote) {
          winningVote = votes.vote;
        }
      }
    // var eventToTrigger = votes.winningVote.eventId.willTrigger;
    });
    return "56b0ec617990997c9e970374";
  }).then(function(toTrigger) {
    return Event.findById(toTrigger).exec();
  }).then(function(eventToTrigger) {
    // console.log(eventToTrigger)
    // console.log(eventHandler.text)
    eventHandler[eventToTrigger.type](eventToTrigger);

  });
});
