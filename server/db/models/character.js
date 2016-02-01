var mongoose = require('mongoose');

var goalSchema = new mongoose.Schema({
  description: {
    type: String
  },
  visibility: {
    type: Boolean
  }
});

var abilitySchema = new mongoose.Schema({
  description: {
    type: String
  },
  visibility: {
    type: Boolean
  },
  willTrigger: {
    type: mongoose.Schema.objectId,
    ref: 'Event'
  }
});

var limitationSchema = new mongoose.Schema({
  description: {
    type: String
  },
  visibility: {
    type: Boolean
  },
  willTrigger: {
    type: mongoose.Schema.objectId,
    ref: 'Event'
  }
});

var schema = new mongoose.Schema({
  name: {
    type: String
  },
  position: {
    type: String
  },
  goals: {
    type: [goalSchema]
  },
  background: {
    type: String
  },
  abilities: {
    type: [abilitySchema]
  },
  limitations: {
    type: [limitationSchema]
  }
});

mongoose.model('Character', schema);
