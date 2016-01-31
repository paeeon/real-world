'use strict';
var router = require('express').Router();
// var mongoose = 

var Firebase = require('firebase');
var game = require('./gameInfo.js');
var gameInfo = game.game;
var time = Date.now();

var myFirebaseRef = new Firebase("https://flickering-inferno-4436.firebaseio.com/");
var namesRef = new Firebase("https://flickering-inferno-4436.firebaseio.com/names");
var timesLogged = 0;

var startTime = Date.now();
// var timed = gameInfo.events.timed;
var gameID, gameRef;



router.get('/build', function (req, res, next) {
	gameRef = myFirebaseRef.child('games').push(game.game);
	gameID = gameRef.key();
	res.status(200).send('game built  <a href="/api/game/start">click to start </a>')
})

var startTimed = function() {
	// console.log(gameID)
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
	      // else person.action();
	    })
	    gameRef.child("pastEvents").child("timed").push({pastEvent:{
	      name:currentEvent.name}});
	  }

	}, 500)
}

router.get('/start', function (req, res, next) {
	startTimed();
	res.status(200).send('game started')
})

module.exports = router;