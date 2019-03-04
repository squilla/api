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
  res.send(await Model.Comment.create(req.body)); // sends status ok and comment
}

module.exports = {
  Index,
  Create,
};
