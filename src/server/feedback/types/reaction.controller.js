const Model = require('../feedback.model');

//  *NOTE: reaction controller only need Index and Create methods,
// *all others inherited from Feedback Controller

//  Returns all Reactions (feedback type)
async function Index(req, res) {
  res.send(await Model.Reaction.find({})); // queries all reaction
}

async function Create(req, res) {
  res.send(await Model.Reaction.create(req.body)); // sends status 200 and reaction
}

module.exports = {
  Index,
  Create,
};
