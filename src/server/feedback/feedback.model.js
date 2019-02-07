const mongoose = require('mongoose');

/*  ********
 ! Chat with Dacio and see if is is necessary to setup like this
 *    FEEDBACK SCHEMA
 *  You can look in user.model for an example of discriminators
 *   There is 1 main feedback model/schema that all other feedback inherit from.
 *  The discriminators of feedback (sub schemas) that all inherit from Feedback
 *  Discriminators of Feedback Model:
 *  - comments
 *  - critiques
 *  - ratings
 *  - reaction
 *
 *
 */


const Schema = mongoose.Schema; // eslint-disable-line

const FeedbackSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  art: {
    type: Schema.Types.ObjectId,
    ref: 'Art',
    required: true,
  },
  feedbackType: {
    type: String,
    required: true,
  },
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback;
