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
  console.log("ahhhhhhhh!");
  Game.find({})
    .then(games => {
      console.log("Getting here!");
      res.status(200).json(games);
    })
    .then(null, next);
});

// var myFirebaseRef = new Firebase("https://flickering-inferno-4436.firebaseio.com/");
var myFirebaseRef = new Firebase("https://character-test.firebaseio.com/");
var game, characters, gameID, gameRef, randomShortId;
var gameShortIdConverter = {};
// gameID = "-K9hE8L_Y2NAxvi8x06R";
// gameRef = myFirebaseRef.child('games').child(gameID);

router.get('/build/:instructionId', function(req, res, next) {
	Game.findById(req.params.instructionId)
	  .lean()
	  .populate('events')
	  .populate('characters')
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
		    event.targets = event.targets.map(function(target){
		    	return target.toString();
		    });
	      eventMap[event._id] = event;
	      if(event.type === "choice") {
	      	choiceEvents[event._id] = {targets:event.targets};
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
	    // console.log("GAME IS", game);
	    characters = _.shuffle(game.characters);
	    myFirebaseRef.child('games').push(game)
	    .then(function(builtGame){
	    	gameRef = builtGame;
	    	console.log("THIS IS THE RESULT", builtGame);
	    	gameID = gameRef.key();
	    	randomShortId = chance.string({length: 4, pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@%&+?'});
	    	gameShortIdConverter[randomShortId] = gameID;
	    	myFirebaseRef.child('games').update({'gameShortIdConverter': gameShortIdConverter})
	    	.then(function(){
	    		gameShortIdConverter = {};
	    		res.json(gameID);
	    	})
	    })	    
	  }).then(null, console.log);
});

var resolveEvent = function(eventToResolve) {
  gameRef.child('resolveTable').child(eventToResolve._id.toString())
    .once('value', function(snapshot) {
      eventToResolve.eventThatOccurred.replace('PLACEHOLDER', snapshot.val());
      textEvents(eventToResolve);
    });
};

function textEvents(textEvent) {
  textEvent.targets.forEach(function(targetId){
    targetId = targetId.toString();
    gameRef.child('characters').child(targetId).child("message").push({message:textEvent.eventThatOccurred});
  });
}

var eventHandler = {
	// pushes the most recent message to a characters firebase message array which will be displayed on the characters dashboard
	text : function(textEvent){
    if (textEvent.needsResolution) resolveEvent(textEvent);
    else textEvents(textEvent);
	},

	// pushes a choice to the characters decisions firebase array which will be displayed on the characters dashboard
	choice: function(choiceEvent) {
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

var startTimed = function() {

  var startTime = Date.now();
  	var timed = []
  	Object.keys(game.events).forEach(function(eventKey){
  		if(game.events[eventKey].triggeredBy === "time") {
  			timed.push(game.events[eventKey]);
  		}
  	});

	  timed.sort(function(a,b){
	  	return b.timed.timeout - a.timed.timeout;
	  });
  return setInterval(function(){
	  if (timed.length < 1) return;
	  if(Date.now() - startTime >= timed[timed.length-1].timed.timeout){
	    var currentEvent = timed.pop();
	    eventHandler[currentEvent.type](currentEvent)
	    gameRef.child("pastEvents").child("timed").push({pastEvent:{
	      name:currentEvent.eventThatOccurred || ""}});
	  }

	}, 500)
}

// we should put in a safeguard when we launch to disallow a user from loggin in twice!
router.post('/:gameId/register-character', function(req, res, next){
	var character;
  // characters is a shuffled array of all the characters in this game
  // If there are characters to fill (that have not been assigned),
	if (characters.length > 0) {
	console.log("characters are", characters);
    character = characters.pop();
    myFirebaseRef.child("games").child(gameID).child("characters").child(character._id.toString()).update({"playerName": req.body.playerName, "playerNumber": req.body.playerNumber});
		res.status(201).json({_id:character._id});
	}
	else {
		var err = new Error("There is no more room in the game! Sorry!");
		next(err);
	}
});

router.get('/start', function(req, res, next) {
  startTimed();
  res.status(200).send('game started')
});

router.post('/event/:eventId', function(req, res, next) {
  Event.findById(req.params.eventId).exec()
    .then(function(foundEvent) {
      eventHandler[foundEvent.type](foundEvent);
    }).then(null, next);
})

require('./vote-listening.js')
module.exports = {
  router: router,
  eventHandler: eventHandler
};
