'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var Event = mongoose.model('Event');
var _ = require('lodash');
var Firebase = require('firebase');
var Chance = require('chance');
var chance = new Chance();
var gameHelper = require('./gameHelper');
var eventHandler = gameHelper.eventHandler;
var invokeEvent = gameHelper.invokeEvent;
var eventNest = gameHelper.eventNest;
var idFix = gameHelper.idFix;


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
var characters, gameID, gameRef, randomShortId, startTime;
var gameShortIdConverter = {};
// gameID = "-K9hE8L_Y2NAxvi8x06R";
// gameRef = myFirebaseRef.child('games').child(gameID);

router.get('/build/:instructionId', function(req, res, next) {
  Game.findById(req.params.instructionId)
    .lean()
    .populate('events characters')
    .then(function(foundGame) {
      var game = foundGame;
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
      var gameRef = myFirebaseRef.child('games').push(game);
      var gameID = gameRef.key();
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
      myFirebaseRef.child('games')
        .child("gameShortIdConverter")
        .update(gameShortIdConverter);
      gameShortIdConverter = {};
      res.json(gameID);
    }).then(null, console.log);
});



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

//should refactor this to run off the firebase event table
router.post('/game/:gameId/event/:eventId', function(req, res, next) {
  var gameId = req.params.gameId;
  var eventId = req.params.eventId
  Event.findById(eventId).exec()
    .then(function(foundEvent) {
      invokeEvent(gameId, foundEvent);
    }).then(null, next);
});

// require in vote listener file to turn on vote event listener
require('./vote-listening.js')
module.exports = {
  router: router,
  eventHandler: eventHandler,
  invokeEvent: invokeEvent
};

