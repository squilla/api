const Model = require('../feedback.model');

/*
 * * Note about Comment Controller:
 * * It only needs index and create methods, all others are inherited from feedback controller
 ****************** */

// Indexes all Comments (a feedback type)
async function Index(req, res) {
  res.send(await Model.Comment.find());
}

//  Creates a new Comment (feedback discriminator)
async function Create(req, res) {
  const comment = new Model.Comment(req.body);
  await comment.save();
  res.status(200).send('Comment Successfully Created.');
}

module.exports = {
  Index,
  Create,
};
