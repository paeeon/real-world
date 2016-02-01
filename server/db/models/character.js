var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: {
    type: String
  },
  position: {
    type: String
  },
  goals: [{
    type: mongoose.Schema.ObjectId,
    ref: "Goal"
  }],
  background: {
    type: String
  },
  abilities: [{
    type: mongoose.Schema.ObjectId,
    ref: "Ability"
  }],
  limitations: [{
    type: mongoose.Schema.ObjectId,
    ref: "Limitation"
  }]
});

mongoose.model('Character', schema);
