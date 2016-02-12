'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var Event = mongoose.model('Event');
var _ = require('lodash');
var Firebase = require('firebase');
var Chance = require('chance');
var chance = new Chance();
var resolveAllCharacters = require('./resolution')

router.get('/', function(req, res, next) {
  Game.find({})
    .then(games => {
      res.status(200).json(games);
    })
    .then(null, next);
});

var games = {};
var gameStarted = {};
// var myFirebaseRef = new Firebase("https://flickering-inferno-4436.firebaseio.com/");
var myFirebaseRef = new Firebase("https://character-test.firebaseio.com/");
var game, characters, gameID, gameRef, randomShortId, startTime;
var gameShortIdConverter = {};
// gameID = "-K9hE8L_Y2NAxvi8x06R";
// gameRef = myFirebaseRef.child('games').child(gameID);

var idFix = function(game) {
  // For each key in game…
  for (var key in game) {
    // If the key is __id, set its value to a toString-ified version of itself
    if (key === "_id") {
      game[key] = game[key].toString();
      // If the value of a key is an object, perform idFix on that object.
    } else if (typeof game[key] === 'object') {
      idFix(game[key]);
    }
  }
};

router.get('/build/:instructionId', function(req, res, next) {
  Game.findById(req.params.instructionId)
    .lean()
    .populate('events characters')
    .then(function(foundGame) {
      game = foundGame;
      var characterMap = {};
      var eventMap = {};
      game.characters.forEach(function(character) {
        character.goals = character.goals.map(function(goal){
          if (goal.resolvedBy) goal.resolvedBy = goal.resolvedBy.toString();
          return goal
        })
        characterMap[character._id] = character;
      });
      var choiceEvents = {};
      var resolve = {};
      game.events.forEach(function(event) {
        event.targets = event.targets.map(function(target) {
          return target.toString();
        });
        eventMap[event._id] = event;
        if (event.type === "choice") {
          choiceEvents[event._id] = {
            targets: event.targets
          };
        }
        if (event.needsResolution) {
            var id = event._id.toString();
            resolve[id] = 'PLACEHOLDER';
          }
      });
      game.votes = choiceEvents;
      game.characters = characterMap;
      game.events = eventMap;
      game.resolveTable = resolve;
      characters = _.shuffle(game.characters);
      idFix(game);
      return myFirebaseRef.child('games').push(game);
    }).then(function(builtGame) {
      gameRef = builtGame;
      gameID = gameRef.key();
      games[gameID] = game;
      gameStarted[gameID] = false;
      // gameRef.once("value", function(data) {
      //   games[gameID] = data.val();
      // });
      randomShortId = chance.string({
        length: 4,
        pool: 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'
      });
      gameShortIdConverter[randomShortId] = gameID;
      return myFirebaseRef.child('games')
        .child("gameShortIdConverter")
        .update(gameShortIdConverter);
    }).then(function() {
      gameShortIdConverter = {};
      res.json(gameID);
    }).then(null, console.log);
});

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

// Function for starting timed events
var startTimed = function(gameId) {
  gameStarted[gameId] = true;

  var timed = [];
  var eventTriggered = [];
  var game = games[gameId];
  // Loop through the keys of each of the game's events
  Object.keys(game.events).forEach(function(eventKey) {
    // If a game event has a 'triggeredBy' attribute set to "time",
    // push that game event to the 'timed' array.
    if (game.events[eventKey].triggeredBy === "time") {
      timed.push(game.events[eventKey]);
    } else if (game.events[eventKey].triggeredBy === 'event') {
      eventTriggered.push(game.events[eventKey]);
    }
  });

  // console.log("Timed array", timed);
  console.log("EventTriggered array", eventTriggered);

  // Organize the events in the timed array, in order from latest to the soonest
  timed.sort(function(a, b) {
    return b.timed.timeout - a.timed.timeout;
  });

  game.startTime = Date.now();

  // Every 500 milliseconds, do this function:
  return setInterval(function() {
    // IF there are no timed events left, do nothing
    if (timed.length < 1) {
      return;
    }
    // IF the time that has elapsed in the game is greater than or equal to the
    // timeout of the last element in the timed array (which should be the timed
    // event that will happen soonest, a.k.a. the event that should happen now), THEN…
    //   1. Remove the event that should happen now and save it to a temporary variable 'currentEvent'
    //   2. Call the eventHandler function with 'currentEvent'
    //   3. Push object to Firebase, under the specific game we're in > "pastEvents" > "timed".
    //      This object will have a key "pastEvent" and a value with another object.
    //      This inner object has a key of name and a value of the eventThatOccurred
    //      (i.e., "The winners have been announced!"), or an empty string (if nothing exists on that
    //      object at the requested location).

    // unComment this line when not testing!
    // if (Date.now() - game.startTime >= timed[timed.length - 1].timed.timeout) {
    if (Date.now() - game.startTime >= timed[timed.length - 1].timed.timeout * 60 * 1000) {
      var currentEvent = timed.pop();
      eventNest(currentEvent, eventTriggered, gameId);
    }
  }, 500);
};

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

// we should put in a safeguard when we launch to disallow a user from loggin in twice!
router.post('/:gameId/register-character', function(req, res, next) {
  var character;
  // characters is a shuffled array of all the characters in this game
  // If there are characters to fill (that have not been assigned),
  if (characters.length > 0) {
    character = characters.pop();
    myFirebaseRef.child("games").child(req.params.gameId).child("characters").child(character._id.toString()).update({
      "playerName": req.body.playerName,
      "playerNumber": req.body.playerNumber
    });
    res.status(201).json({
      _id: character._id
    });
  } else {
    var err = new Error("There is no more room in the game! Sorry!");
    next(err);
  }
});

router.get('/start/:gameId', function(req, res, next) {

  // If this game has not already started, start its timer
  if (!gameStarted[req.params.gameId]) {
    startTimed(req.params.gameId);
  }

  res.status(200).send('game started');
});

router.get('/:gameId', function(req, res, next) {
  Game.findById(req.params.gameId)
    .then(game => {
      res.status(200).json(game);
    })
    .then(null, next);
});

router.post('/event/:eventId', function(req, res, next) {
  Event.findById(req.params.eventId).exec()
    .then(function(foundEvent) {
      eventHandler[foundEvent.type](foundEvent);
    }).then(null, next);
});

// require in vote listener file to turn on vote event listener
require('./vote-listening.js')
module.exports = {
  router: router,
  eventHandler: eventHandler
};