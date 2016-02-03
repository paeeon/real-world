'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var Character = mongoose.model('Character');
var Event = mongoose.model('Event');
var _=require('lodash');
var Firebase = require('firebase');


router.get('/', function(req, res, next) {
  Game.find({})
    .then(games => {
      res.status(200).json(games);
    })
    .then(null, next);
});

var game, characters;
var myFirebaseRef = new Firebase("https://character-test.firebaseio.com/");

var gameID, gameRef;

router.get('/build/:instructionId', function (req, res, next) {
	Game.findById(req.params.instructionId)
	.lean()
	.populate('events')
	.populate('characters')
	.then(function(foundGame) {
		console.log(game)
		game = foundGame;
		var characterMap = {};
		var eventMap = {};
		game.characters.forEach(function(character){
			//console.log("character:", character);
			characterMap[character._id] = character;
		})

		game.events.forEach(function(event){
			eventMap[event._id] = event;
		})

		console.log("character map is", characterMap);
		game.characters = characterMap;
		game.events = eventMap;
		// console.log("GAME IS", game);
		characters = _.shuffle(game.characters);
		gameRef = myFirebaseRef.child('games').push(game);
		gameID = gameRef.key();
		console.log("ID IS", gameID);
		res.json(gameID);
	})
});

var eventHandler = {
	//textEvent example object
	// {
	// 	text: "things to say",
	// 	title: "title of things to say",
	// 	characterIds: [characterIds]
	// }
	// pushes the most recent message to a characters firebase message array which will be displayed on the characters dashboard
	text : function(textEvent){

		textEvent.targets.forEach(function(targetId){
			gameRef.child(targetId).child("message").push({message:textEvent.eventThatOccurred});
		});
	},


	/*
	some_choiceEvent = {
	characterIds: [characterIds],
	question: "who? what? Where?"
	choices: [{choice object},{choice object}...]
	rootEvent: eventId,
	eventToTrigger: eventId,
	}
	*/
	choice: function(choiceEvent) {
	    choiceEvent.targets.forEach(function(targetId) {
	        gameRef.child(targetId).child("decisions").push({
	            eventId: choiceEvent._id,
	            message: choiceEvent.eventThatOccurred,
	            decision: choiceEvent.decision
	        });
	    })
	}
}

var startTimed = function() {

  var startTime = Date.now();
  return setInterval(function(){
	  var timed = game.events.filter(function(thisEvent){
	  	return thisEvent.triggeredBy === "time";
	  }).sort(function(a,b){
	  	return b.timed.timeout - a.timed.timeout;
	  });
	  console.log(timed)
	  if (timed.length < 1) return;
	  if(Date.now() - startTime >= timed[timed.length-1].timed.timeout){
	    var currentEvent = timed.pop();
	    eventHandler[currentEvent.type](currentEvent)
	    gameRef.child("pastEvents").child("timed").push({pastEvent:{
	      name:currentEvent.name}});
	  }

	}, 500)
}

// we should put in a safeguard when we launch to disallow a user from loggin in twice!
router.post('/:gameId/register-character', function(req, res, next){
	var character;

  // characters is a shuffled array of all the characters in this game
  // If there are characters to fill (that have not been assigned),
	if (characters.length > 0) {
    character = characters.pop();
    console.log("GAME ID IS", gameID);
    console.log("._ID", character._id);
    myFirebaseRef.child("games").child(gameID).child("characters").child(character._id.toString()).update({"playerName": req.body.playerName, "playerNumber": req.body.playerNumber});
		res.status(201).json({_id:character._id});
	}
	else {
		var err = new Error("There is no more room in the game! Sorry!");
		next(err);
	}
});

router.get('/start', function (req, res, next) {
	startTimed();
	res.status(200).send('game started')
});

router.post('/event/:eventId', function(req, res, next){
	Event.findById(req.params.eventId).exec()
	.then(function(foundEvent){
		eventHandler[foundEvent.type](foundEvent);
	}).then(null, next);
})


module.exports = router;
