var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: {
    type: String
  },
  position: {
    type: String
  },
  goals: [{
    description: {
      type: String
    },
    visibility: {
      type: Boolean
    }
  }],
  background: {
    type: String
  },
  abilities: [{
    description: {
      type: String
    },
    visibility: {
      type: Boolean
    },
    willTrigger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }
  }],
  limitations: [{
    description: {
      type: String
    },
    visibility: {
      type: Boolean
    },
    willTrigger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }
  }]
});

mongoose.model('Character', schema);