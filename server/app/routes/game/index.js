'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var Character = mongoose.model('Character');
var Event = mongoose.model('Event');
// var deepPopulate = require('mongoose-deep-populate')(mongoose);
// Game.plugin(deepPopulate);
var _=require('lodash');
var Firebase = require('firebase');
// var game = require('./gameInfo.js');

console.log("director:", __dirname);
// var gameInfo = game.game;
var time = Date.now();
// var characters = _.shuffle(gameInfo.characters);

var myFirebaseRef = new Firebase("https://character-test.firebaseio.com/");
var namesRef = new Firebase("https://flickering-inferno-4436.firebaseio.com/names");
var timesLogged = 0;

var gameID, gameRef;

router.get('/build', function (req, res, next) {
	Game.findById("56b11c9ae12b563810dc78bb")
	.lean()
	.populate('events')
	.populate('characters')
	.then(function(game){
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
		gameRef = myFirebaseRef.child('games').push(game);
		gameID = gameRef.key();
		// console.log("ID IS", gameID);
		res.json(game);
	})
	// 
	//res.status(200).send('game built  <a href="/api/game/start">click to start </a>')
})

var startTimed = function() {

  var startTime = Date.now();
  return setInterval(function(){
	  var timed = gameInfo.events.timed
	  if (timed.length < 1) return;
	  if(Date.now() - startTime >= timed[timed.length-1].time){
	    var currentEvent = timed.pop();
	    currentEvent.effect.forEach(function(person){
	      if(person.type === "text"){
	        gameRef.child("characters").child(person.index).child("actions").push({eventName:currentEvent.name, action:person.action})
	      }
	    })
	    gameRef.child("pastEvents").child("timed").push({pastEvent:{
	      name:currentEvent.name}});
	  }

	}, 500)
}

router.post('/register', function(req, res, next){
	var character;
	if(characters.length > 0) {
		character = characters.pop()
		character.name = req.body.name;
		res.status(201).json(character);
	}
	else{
		var err = new Error("There is no more room in the game! Sorry!")
		next(err);
	}
})

router.get('/start', function (req, res, next) {
	startTimed();
	res.status(200).send('game started')
})

module.exports = router;