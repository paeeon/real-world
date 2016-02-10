var gamesRef = new Firebase("https://character-test.firebaseio.com/games/");
gamesRef.on('child_added', function(dataSnapshot) {
  var game = dataSnapshot.key();
  var gameRef = gamesRef.child(game);
  var voteRef = gameRef.child('votes');
  var mongoose = require('mongoose');
  var Event = mongoose.model('Event');
  var i = 0;
  voteRef.on('child_changed', function(childSnapshot, prevChildKey) {
    console.log("CHILD SNAPSHOT IS", childSnapshot.val());
    var eventHandler = require('./index').eventHandler;
    i++;
    var currentVote = childSnapshot.val();
    var parentRef = voteRef.child(childSnapshot.key());
    console.log('votes logged', childSnapshot.numChildren()-1);
    console.log('expected numer of votes', currentVote.targets.length);
    var votes = {};

    Event.findById(parentRef.key()).exec()
    .then(function(currentEvent) {
      if (childSnapshot.numChildren()-1 === currentEvent.targets.length) {
        var parent;
        parentRef.once('value', function(parentSnap){
          parent = parentSnap.val();
        });
        // console.log(parent)
        childSnapshot.forEach(function(snapshot) {
          console.log("SNAPSHOT INSIDE CHILD IS", snapshot.val());
          if (snapshot.val().choice){
            console.log("GOT INTO CHOICE LOGIC!");
            var vote = snapshot.val();
          console.log("HI THIS IS THE VOTE", vote);
            if (!votes[vote.choice]) {
              votes[vote.choice] = vote;
              votes[vote.choice].count = 1;
            } else {
              votes[vote.choice].count++;
            }
          }
        });
      }
      console.log("VOTES OBJECT", votes);
      var winningVote = {max:0};
      Object.keys(votes).forEach(function(vote) {
        console.log("WE IN OBJECT KEYS YO");
        if (!winningVote.winner) {
          winningVote.winner = vote; //need to set .winner
          console.log("WE IN NO WINNING VOTE WINNER", winningVote);
          // console.log("WHAT IS VOTES[VOTE]?", votes[vote])
        }
        else {
          //i have no clue what the hell this is doing
          if (winningVote.max < votes[vote].count) { //need to grab vote.count
            winningVote.winner = vote;
            winningVote.max = votes[vote].count;
            console.log("COUNT HERE IS", vote.count);
            console.log("WINNING VOTE.WINNER IS", winningVote.winner);
          }
        }
      });
      console.log("DOES THE CURRENT EVENT HAVE A WILL RESOLVE?", currentEvent.decision);
      if (currentEvent.decision.willResolve) {
        //CHECK THIS!! this should work.
        console.log("HEY WHAT IS HAPPENING HERE");
        gameRef.child('resolveTable').child(currentEvent._id.toString()).set(winningVote.winner); //input winningVote.winner
        //need to make this asynchronous (.THEN OFF OF IT) --might be okay
      }
      return votes[winningVote.winner].willTrigger;
    }).then(function(toTrigger) {
      return Event.findById(toTrigger).exec();
    }).then(function(eventToTrigger) {
      eventHandler[eventToTrigger.type](eventToTrigger);

    }).then(null, console.log);
  });
});
