var mongoose = require('mongoose');


var schema = new mongoose.Schema({
  triggeredBy: {
    type: String,
    enum: ['time', 'event', 'character', 'random']
  },
  willTrigger: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event'
  },
  type: {
    text: {
      type: String
    },
    decision: {
      question: {
        type: String
      },
      choices: [{
        type: String
      }],
      willTrigger: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event'
      }
    }
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
  }
});

mongoose.model('Event', schema);
