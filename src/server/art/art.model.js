const mongoose = require('mongoose');

const { Schema } = mongoose;

const ArtSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Art', ArtSchema);
