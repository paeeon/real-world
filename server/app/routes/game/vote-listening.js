var voteRef = new Firebase("https://flickering-inferno-4436.firebaseio.com/votes");
var Event = mongoose.model('Event');

voteRef.on('child-added', function(childSnapshot, prevChildKey) {
  var eventHandler = require('./index').eventHandler;
  // array of obj --> [{choice: ..., willTrigger: ...}]
  var currentVote = childSnapshot.val();
  var parent = childSnapshot.parent().val();
  var parentKeys = Object.keys(parent);
  var votes = {};
  Event.findById(currentVote.eventId).exec()
  .then(function(currentEvent) {
    if (parentKeys.length === currentEvent.targets.length) {
      parentKeys.forEach(function(vote) {
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
    });
    var eventToTrigger = votes.winningVote.eventId.willTrigger;
    return eventToTrigger;
  }).then(function(toTrigger) {
    return Event.findById(toTrigger).exec();
  }).then(function(eventToTrigger) {
    eventHandler[eventToTrigger.type](eventToTrigger);
  });
});
