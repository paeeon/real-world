var mongoose = require('mongoose');
var Game;
var schema = new mongoose.Schema({
  title: {
    type: String
    // required: true
  },
  triggeredBy: {
    type: String,
    enum: ['time', 'event', 'character', 'random']
  },
  willTrigger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  needsResolution: {
    type: Boolean
  },
  type: {
    type: String,
    enum: ['text', 'choice']
  },
  eventThatOccurred: {
    type: String
  },
  decision: {
    willResolve: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    willResolveName: {
      type: String
    },
    question: {
      type: String
    },
    choices: [{
      choice: {
        type: String
      },
      willTrigger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
      }
    }]
  },
  targets: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Character'
  }],
  timed: {
    cause: {
      type: String,
      enum: ['game', 'event']
    },
    timeout: {
      type: Number
    }
  },
  endsGame:{
    type:Boolean,
    default: false
  }
});

schema.statics.createEndGame = function (gameId) {
  var Event = this;
  var endGameEvent;
  Game = mongoose.model('Game');
  var endGame ={
    type: 'text',
    endsGame:true
  };
  return Event.create(endGame)
  .then(function(newGame){
    endGameEvent = newGame;
    return Game.findById(gameId)
    })
  .then(function(foundGame){
    foundGame.events.push(endGameEvent._id)
    // console.log(foundGame.save())
    return foundGame.save();
  })
}

mongoose.model('Event', schema);
