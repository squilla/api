const Model = require('../feedback.model');

//  *NOTE: reaction controller only need Index and Create methods,
// *all others inherited from Feedback Controller

//  Returns all Reactions (feedback type)
async function Index(req, res) {
  res.send(await Model.Reaction.find());
}

async function Create(req, res) {
  const reaction = new Model.Reaction(req.body);
  await reaction.save(); //  saving new reaction with data from req.body
  res.status(200).send('Reaction successfully created.');
}

module.exports = {
  Index,
  Create,
};
