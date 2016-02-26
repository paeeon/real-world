var gamesRef = new Firebase("https://character-test.firebaseio.com/games/");
// when a new game is added a listener is deployed for that game
gamesRef.on('child_added', function(dataSnapshot) {
  var gameId = dataSnapshot.key();
  var gameRef = gamesRef.child(gameId);
  var voteRef = gameRef.child('votes');
// Deploy a listener for changes to the games choice event
  voteRef.on('child_changed', function(voteSnapshot, prevChildKey) {
    var eventHandler = require('./gameHelper').eventHandler;
// Set current vote equal to the snapshot of the vote
    var currentVote = voteSnapshot.val();
    var parentRef = voteRef.child(voteSnapshot.key());
    if (voteSnapshot.numChildren()-1 === currentVote.targets.length) {
// Grab event info from firebase if we have the appropriate number of votes
      gameRef.child('events').child(parentRef.key()).once('value', function(dataSnapshot){
        var currentEvent = dataSnapshot.val();
// Call our vote counting function
        var winningVote = countVotes(voteSnapshot);
        if (currentEvent.decision.willResolve) {
// Post the winner of the vote event to the resolve table so it can be retreived when needed
          gameRef.child('resolveTable')
            .child(currentEvent.decision.willResolve.toString())
            .set(winningVote); 
        }
        if (currentEvent.willTrigger){
// if this event needs to trigger another event directly it will find it and invoke the event using the event handler
          gameRef.child('events').child(willTrigger.toString())
          .once(value, function(toTriggerSnapshot){
            var eventToTrigger = toTriggerSnapshot.val();
            eventHandler[eventToTrigger.type](gameId, eventToTrigger)
          })
        }
      })
    }
  });
});

// We are using the firebase forEach method since snapshots of firebase arrays are 
// not actually arrays or even array like objects. We'll loop through the votes
// counting them and comparing them to the lead vote getter, then return
// the string of the winning vote

function countVotes(voteSnapshot){
  var votes = {};
  var leadingVote = 0;
  var winningVote;
  voteSnapshot.forEach(function(snapshot) {
    if (snapshot.val().choice){
      var vote = snapshot.val();
      if (!votes[vote.choice]) {
        votes[vote.choice] = vote;
        votes[vote.choice].count = 1;
      } else {
        votes[vote.choice].count++;
      }
      if(votes[vote.choice].count > leadingVote) {
        leadingVote = votes[vote.choice].count;
        winningVote = vote.choice;
      }
    }
  });
  return winningVote;
}