var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Event = Promise.promisifyAll(mongoose.model('Event'));
var Character = Promise.promisifyAll(mongoose.model('Character'));
var Game = Promise.promisifyAll(mongoose.model('Game'));
var Char = mongoose.model('Character');

var eventIds;
var characterIds;
var characterObj;

var connectEvents = function() {
  var eventToResolveName;

  return Event.find({type: "choice"})
  .then(function(events){
    console.log("GOT INTO EVENTS");
    console.log("EVENTS ARE", events);
    events.forEach(function(event){
      //get the name of the event to resolve to
      eventToResolveName = event.decision.willResolveName;
      console.log("RESOLVE NAME", eventToResolveName);


      //get the id of that event
      Event.findOne({title: eventToResolveName})
      .then(function(matchingEvent){
        console.log("GOT A MATCHING EVENT", matchingEvent._id);

        //set that id to the willResolve of the event
        event.decision.willResolve = matchingEvent._id;
        console.log("WILL RESOLVE NOW IS", event.decision.willResolve);

        return event.save();
      })
    });
      // console.log("GOT INTO FOR EACH");
      // eventToResolveName = event.decision.willResolveName;
      // console.log("RESOLVE NAME", eventToResolveName);
        // Event.find({title: eventToResolveName})
        // .then(function(eventToResolve){
        //   console.log("GOT INTO NEXT FIND EVENT");
        //   eventToResolveID = eventToResolve._id;
        //   console.log("RESOLVE ID", eventToResolveID);
        //   event.decision.willResolve = eventToResolveID;
        // })
    // })
  })
}

connectToDb.then(function () {
    connectEvents()
      .then(function(linkedEvents){
        process.kill(0);
        // console.log(linkedEvents);
      })

});
