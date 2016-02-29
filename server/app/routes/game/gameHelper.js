var resolveAllCharacters = require('./resolution')

var eventHandler = {
  // pushes the most recent message to a characters firebase message array
  // which will be displayed on the characters dashboard
  text: function(gameId, textEvent) {
    if (textEvent.needsResolution) {
      return resolveEvent(gameId, textEvent);
    }
    else if (textEvent.endsGame.toString() === "true") {
      return resolveAllCharacters(gameId);
    } //investigate this further
    else {
      return textEvents(gameId, textEvent);
    } //investigate this further
  },
  // pushes a choice to the characters decisions firebase array
  // which will be displayed on the characters dashboard
  choice: function(gameId, choiceEvent) {
    return choiceEvents(gameId, choiceEvent);
  }
};


function idFix(game) {
    // For each key in game…
    for (var key in game) {
        // If the key is __id, set its value to a toString-ified version of itself
        if (key === "_id" || key === "willResolve") {
            game[key] = game[key].toString();
            // If the value of a key is an object, perform idFix on that object.
        } else if (typeof game[key] === 'object') {
            idFix(game[key]);
            console.log("no recursion error")
        }
    };
}

// helper function
function choiceEvents(gameId, choiceEvent) {
  var gameRef = new Firebase("https://character-test.firebaseio.com/games/" + gameId);
  choiceEvent.targets.forEach(function(targetId) {
    targetId = targetId.toString();
    gameRef.child('characters').child(targetId).child("decisions").push({
      eventId: choiceEvent._id,
      message: choiceEvent.eventThatOccurred || "",
      decision: choiceEvent.decision,
      answered: false
    });
  });
}

// This is a helper function for resolveEvent. It pushes to a character's 'message's
// when an event happens.
function textEvents(gameId, textEvent) {
  var gameRef = new Firebase("https://character-test.firebaseio.com/games/" + gameId);
  textEvent.targets.forEach(function(targetId) {
    targetId = targetId.toString();
    gameRef.child('characters').child(targetId).child("message").push({
      message: textEvent.eventThatOccurred
    });
  });
}

// helper function
function resolveEvent(gameId, eventToResolve) {
  var gameRef = new Firebase("https://character-test.firebaseio.com/games/" + gameId);
  gameRef.child('resolveTable').child(eventToResolve._id.toString())
  .on('value', function(snapshot) { //HERE IS WHERE I THINK THE PROBLEM IS NOW!!!!!!
    if (snapshot.val() !== 'PLACEHOLDER') {
      eventToResolve.eventThatOccurred = eventToResolve.eventThatOccurred.replace('PLACEHOLDER', snapshot.val());
      gameRef.child('resolveTable').child(eventToResolve._id.toString()).off('value');
      return textEvents(gameId, eventToResolve);
    }
  });
}

function invokeEvent(gameId, currentEvent) {
  eventHandler[currentEvent.type](gameId, currentEvent);
  var gameRef = new Firebase("https://character-test.firebaseio.com/games/" + gameId);
  gameRef.child("pastEvents").child("timed").push({
    pastEvent: {
      name: currentEvent.eventThatOccurred || "",
      type: currentEvent.type,
      decision: currentEvent.decision || "",
      targets: currentEvent.targets
    }
  });
}

function eventNest(currentEvent, eventTriggeredArr, gameId, idx) {
  // if the event is triggered by an event
  // remove it from event triggered array
  if (idx) {
    eventTriggeredArr.splice(idx, 1);
  }
  // if the event will trigger another event
  if (currentEvent.willTrigger) {
    var eventIdx;
    // find the event that it triggers
    var eventToTrigger = eventTriggeredArr.filter(function(event, i) {
      if (event._id == currentEvent.willTrigger) {
        eventIdx = i;
        return true;
      }
      else {
        return false;
      }
    })[0];
    // send current event to game on firebase
    invokeEvent(gameId, currentEvent);
    // set timeout for triggered event
    setTimeout(function () {
      // run eventNest with the triggered event on timeout
      eventNest(eventToTrigger, eventTriggeredArr, gameId, eventIdx);
    }, eventToTrigger.timed.timeout * 60 * 1000); //uncomment when not testing
    // }, eventToTrigger.timed.timeout);
  }
  // if this event will resolve another event
  else if (currentEvent.decision.willResolve) {
    var eventIdx;
    // find the event that it resolves
    var eventToResolve = eventTriggeredArr.filter(function(event, i) {
      if (event._id == currentEvent.decision.willResolve) {
        eventIdx = i;
        return true;
      }
      else {
        return false;
      }
    })[0];
    // send current event to game on firebase
    invokeEvent(gameId, currentEvent);
    // set timeout for event to be resolved
    setTimeout(function () {
      // run eventNest with the event that needs to be resolved
      eventNest(eventToResolve, eventTriggeredArr, gameId, eventIdx);
    }, eventToResolve.timed.timeout * 60 * 1000); //uncomment when not testing
    // }, eventToResolve.timed.timeout);
  } else {
    return invokeEvent(gameId, currentEvent);
  }

}

module.exports = {
    idFix: idFix,
    eventHandler: eventHandler,
    resolveEvent:resolveEvent,
    invokeEvent:invokeEvent,
    eventNest:eventNest
}
