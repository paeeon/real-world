var mongoose = require('mongoose');


var schema = new mongoose.Schema({
  title: {
    type: String
  },
  setting: {
    type: String
  },
  overview: {
    type: String
  },
  characters: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Character'
  }],
  events: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Event'
  }]
});

mongoose.model('Game', schema);
