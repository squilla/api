const Model = require('./feedback.model');
const commentController = require('./types/comment.controller');
const reactionController = require('./types/reaction.controller');

//  returns all feedback objects
async function Index(req, res) {
  res.send(await Model.Feedback.find());
}

//  Returns specific Feedback object given ID
async function Get(req, res) {
  res.send(await Model.Feedback.findById(req.params.id));
}
//  Updates specific piece of feedback
async function Update(req, res) {
  res.send(await Model.Feedback.findByIdAndUpdate(req.params.id, req.body));
}

//  Deletes specific feedback object
async function Delete(req, res) {
  await Model.Feedback.findOneAndRemove({ _id: req.params.id });
  return res.status(200).send('Feedback Successfully deleted.');
}
//  Creates certain Type of feedback depending on input
//  *NOTE: may need to update function depending on new feedback types
async function Create(req, res) {
  const fType = req.body.feedbackType;
  if (fType === 'comment') {
    return commentController.Create(req, res);
  }
  return reactionController.Create(req, res); //  * else if (fType === 'reaction')
}

module.exports = {
  Index,
  Get,
  Update,
  Delete,
  Create,
};
