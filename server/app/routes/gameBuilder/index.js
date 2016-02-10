'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var Character = mongoose.model('Character');
var Event = mongoose.model('Event');

// create game
// POST /api/gameBuilder/gameInfo
router.post('/gameInfo', function(req, res, next) {
  Game.create(req.body)
  .then(function(createdGame) {
    res.status(201).json(createdGame);
  }).then(null, next);
});

// create characters
// POST /api/gameBuilder/characterInfo
router.post('/characterInfo', function(req, res, next) {
  Character.create(req.body)
  .then(function(createdCharacter) {
    res.status(201).json(createdCharacter);
  }).then(null, next);
});

// create events
// POST /api/gameBuilder/eventInfo
router.post('/eventInfo', function(req, res, next) {
  Event.create(req.body)
  .then(function(createdEvent) {
    res.status(201).json(createdEvent);
  }).then(null, next);
});

// update game with character or event id
// PUT /api/gameBuilder/gameInfo/:gameId/:prop
router.put('/gameInfo/:gameId/:prop', function(req, res, next) {
  var gameId = req.params.gameId;
  var prop = req.params.prop;
  var updateId = req.body._id;
  Game.findById(gameId).exec()
  .then(function(game) {
    game[prop].push(updateId);
    return game.save();
  }).then(function(response) {
    res.status(200).json('Update successful');
  }).then(null, next);
});

// update events
// PUT /api/gameBuilder/:eventId
router.put('/:eventId', function(req, res, next) {
  var eventId = req.params.eventId;
  var updatedEvent = req.body;
  Event.findById(eventId).exec()
  .then(function(foundEvent) {
    for (var k in updatedEvent) {
      foundEvent[k] = updatedEvent[k];
    }
    // console.log(foundEvent)
    return foundEvent.save();
  }).then(function(response) {
    res.status(200).json('Update successful');
  }).then(null, next);
});

// get characters from game
// GET /api/gameBuilder/:gameId/characters
router.get('/:gameId/characters', function(req, res, next) {
  var gameId = req.params.gameId;
  Game.findById(gameId).populate('characters').exec()
  .then(function(foundGame) {
    res.status(200).json(foundGame.characters);
  }).then(null, next);
});

// get events from game
// GET /api/gameBuilder/:gameId/events
router.get('/:gameId/events', function(req, res, next) {
  var gameId = req.params.gameId;
  Game.findById(gameId).populate('events').exec()
  .then(function(foundGame) {
    console.log("FOUND GAME!");
    console.log(foundGame);
    res.status(200).json(foundGame.events);
  }).then(null, next);
});

module.exports = router;
