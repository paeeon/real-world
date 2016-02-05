var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: {
    type: String
  },
  phone: {
    type: String
  },
  character: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character'
  }
});

mongoose.model('Player', schema);
