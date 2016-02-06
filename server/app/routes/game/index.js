'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var Event = mongoose.model('Event');
var _ = require('lodash');
var Firebase = require('firebase');
var Chance = require('chance');
var chance = new Chance();

router.get('/', function(req, res, next) {
  Game.find({})
    .then(games => {
      res.status(200).json(games);
    })
    .then(null, next);
});

var games = {};

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
        //console.log("character:", character);
        characterMap[character._id] = character;
      })
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
          if (event.needsResolution) {
            var id = event._id.toString();
            resolve[id] = 'replace';
          }
        }
      });
      game.votes = choiceEvents;
      game.characters = characterMap;
      game.events = eventMap;
      game.resolveTable = resolve;
      characters = _.shuffle(game.characters);
      idFix(game);
      return myFirebaseRef.child('games').push(game)
    }).then(function(builtGame) {
      gameRef = builtGame;
      gameID = gameRef.key();
      games[gameID] = game;
      // gameRef.once("value", function(data) {
      //   games[gameID] = data.val();
      // });
      randomShortId = chance.string({
        length: 4,
        pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
      });
      gameShortIdConverter[randomShortId] = gameID;
      return myFirebaseRef.child('games').child("gameShortIdConverter").set(gameShortIdConverter)
    }).then(function() {
      gameShortIdConverter = {};
      res.json(gameID);
    }).then(null, console.log);
});

var resolveEvent = function(gameId, eventToResolve) {
  var gameRef = new Firebase("https://character-test.firebaseio.com/games/" + gameId);
  gameRef.child('resolveTable').child(eventToResolve._id.toString())
    .once('value', function(snapshot) {
      eventToResolve.eventThatOccurred.replace('PLACEHOLDER', snapshot.val());
      textEvents(eventToResolve);
    });
};

// This is a helper function for resolveEvent. It pushes to a character's 'message's
// when an event happens.
function textEvents(gameId, textEvent) {
  var gameRef = new Firebase("https://character-test.firebaseio.com/games/" + gameId);
  textEvent.targets.forEach(function(targetId) {
    // console.log("THIS IS THE TARGET", targetId); //this is the problem with all of the events going twice. is it async? is it too many targets?
    targetId = targetId.toString();
    gameRef.child('characters').child(targetId).child("message").push({
      message: textEvent.eventThatOccurred
    });
  });
}

var eventHandler = {
  // pushes the most recent message to a characters firebase message array which will be displayed on the characters dashboard
  text: function(gameId, textEvent) {
    // console.log("THIS IS THE TEXT EVENT", textEvent);
    if (textEvent.needsResolution) resolveEvent(gameId, textEvent); //investigate this further
    else textEvents(gameId, textEvent); //investigate this further
  },

  // pushes a choice to the characters decisions firebase array which will be displayed on the characters dashboard
  choice: function(gameId, choiceEvent) {
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

}

// Function for starting timed events
var startTimed = function(gameId) {

  console.log("startTimed being called right now…");

  var timed = [];
  var game = games[gameId];

  // Loop through the keys of each of the game's events
  Object.keys(game.events).forEach(function(eventKey) {
    // If a game event has a 'triggeredBy' attribute set to "time",
    // push that game event to the 'timed' array.
    if (game.events[eventKey].triggeredBy === "time") {
      timed.push(game.events[eventKey]);
    }
  });

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
    if (Date.now() - game.startTime >= timed[timed.length - 1].timed.timeout) {
      console.log("TIMED EVENTS IS", timed); //log timed.length every time it is seen!!!!!!!!
      var currentEvent = timed.pop();
      // console.log("CURRENT EVENT IS", currentEvent);
      eventHandler[currentEvent.type](gameId, currentEvent)
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

  }, 500)
};

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

var gameStarted = {};

// var gameStarted = false;
router.get('/start/:gameId', function(req, res, next) {

  // If this game has not already started, start its timer
  if (!gameStarted[req.params.gameId]) {
    startTimed(req.params.gameId);
    gameStarted[req.params.gameId] = true;
  }

  res.status(200).send('game started')
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

require('./vote-listening.js')
module.exports = {
  router: router,
  eventHandler: eventHandler
};
