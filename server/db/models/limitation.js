var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  description: {
    type: String
  },
  visibility: {
    type: Boolean
  }
});

mongoose.model('Limitation', schema);
