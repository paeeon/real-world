var mongoose = require('mongoose');


var schema = new mongoose.Schema({
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
  }
});

mongoose.model('Event', schema);
