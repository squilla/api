const Model = require('../user/user.model');
const authController = require('../auth/auth.controller');
//  NOTE: Aritst is actually a user so ArtistSchema is in User Model

//  Creates a new artist given artist data (check user.model for ArtistSchema)
async function Create(req, res) {
  const artist = await new Model.Artist(req.body);
  await artist.save();
  return authController.issueCookie(res, artist);
}

//  Sends all artist objects in array
async function Index(req, res) {
  res.send(await Model.Artist.find());
}

//  Given an id will send specific artist object
async function Get(req, res) {
  res.send(await Model.Artist.findById(req.params.id));
}

module.exports = {
  Index,
  Create,
  Get,
};
