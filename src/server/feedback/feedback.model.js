const mongoose = require('mongoose');

const options = {
  discriminatorKey: 'kind',
  timestamps: true,
};

/*
 ! Chat with Dacio and see if is is necessary to setup like this
 *    FEEDBACK SCHEMA
 *  You can look in user.model for an example of discriminators
 *   There is 1 main feedback model/schema that all other feedback inherit from.
 *  The discriminators of feedback (sub schemas) that all inherit from Feedback
 *  Discriminators of Feedback Model:
 *  - comments ---done
 *  - critiques
 *  - ratings
 *  - reaction --- done
 */

const Schema = mongoose.Schema; // eslint-disable-line

const FeedbackSchema = new Schema({
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
}, options);

const Feedback = mongoose.model('Feedback', FeedbackSchema);

//* Comments are feedback type where user types in a response
const CommentSchema = new Schema({
  content: {
    type: String,
    trim: true,
  },
}, options);

// requireCom function makes the content required if feedback type is comment
function requireCom() {
  return this.feedbackType === 'comment';
}
//  makes these fields true
CommentSchema.path('content').required(requireCom());

//  Creates comment discriminator of Feedback model
const Comment = Feedback.discriminator('Comment', CommentSchema);

//* Reactions are when users pick one of the predefined 'reactions'/ratings
const ReactionSchema = new Schema({
  reaction: {
    type: String,
  },
  sentiment: {
    type: String,
  },
}, options);

// requireCom function makes the content required if feedback type is comment
function requireReaction() {
  return this.feedbackType === 'reaction';
}
//  makes these fields true
ReactionSchema.path('reaction').required(requireReaction());


//! Need to setup logic for sentiment with reactions.
//! Discuss at meeting
// ReactionSchema.pre('save', () => {

// })

const Reaction = Feedback.discriminator('Reaction', ReactionSchema);

module.exports = {
  Feedback,
  Comment,
  Reaction,
};
