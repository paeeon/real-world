var gamesRef = new Firebase("https://character-test.firebaseio.com/games/");
gamesRef.on('child_added', function(dataSnapshot) {
  var gameId = dataSnapshot.key();
  var gameRef = gamesRef.child(gameId);
  var voteRef = gameRef.child('votes');
  var mongoose = require('mongoose');
  var Event = mongoose.model('Event');
  voteRef.on('child_changed', function(childSnapshot, prevChildKey) {
    var eventHandler = require('./index').eventHandler;
    var currentVote = childSnapshot.val();
    var parentRef = voteRef.child(childSnapshot.key());
    var votes = {};

    Event.findById(parentRef.key()).exec()
    .then(function(currentEvent) {
      if (childSnapshot.numChildren()-1 === currentEvent.targets.length) {
        // var parent;
        // parentRef.once('value', function(parentSnap){
        //   parent = parentSnap.val();
        // });
        childSnapshot.forEach(function(snapshot) {
          if (snapshot.val().choice){
            var vote = snapshot.val();
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
        if (!winningVote.winner) {
          winningVote.winner = vote;
        }
        else {
          //i have no clue what the hell this is doing
          if (winningVote.max < votes[vote].count) { //need to grab vote.count
            winningVote.winner = vote;
            winningVote.max = votes[vote].count;
          }
        }
      });
      if (currentEvent.decision.willResolve) {

        //input winningVote.winner
        gameRef.child('resolveTable').child(currentEvent.decision.willResolve.toString()).set(winningVote.winner); 
        //need to make this asynchronous (.THEN OFF OF IT) --might be okay
      }
      return votes[winningVote.winner].willTrigger;
    }).then(function(toTrigger) {
      return Event.findById(toTrigger).exec();
    }).then(function(eventToTrigger) {
      eventHandler[eventToTrigger.type](gameId, eventToTrigger);

    }).then(null, console.log);
  });
});