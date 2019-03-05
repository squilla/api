const mongoose = require('mongoose');

const { Schema } = mongoose;

const ArtSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
  },
});

module.exports = mongoose.model('Art', ArtSchema);
