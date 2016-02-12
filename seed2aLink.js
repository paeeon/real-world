var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Event = Promise.promisifyAll(mongoose.model('Event'));
var Character = Promise.promisifyAll(mongoose.model('Character'));
var Game = Promise.promisifyAll(mongoose.model('Game'));
var Char = mongoose.model('Character');

var eventId;


connectToDb.then(function () {
  return Event.findOne({title:"Andrew Guess"})
  .then(function(foundEvent){
    eventId = foundEvent._id;
  return Character.findOne({name:"Andrew"})
  })
  .then(function(Andrew){
    // console.log(Andrew)
    Andrew.goals[0].resolvedBy = eventId;
    return Andrew.save();
  })
  .then(function(Andrew){
    console.log(Andrew)
      process.kill(0);
      // console.log(linkedEvents);
    })
});
