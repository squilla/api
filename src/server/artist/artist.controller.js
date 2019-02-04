const Model = require('../user/user.model');

//  NOTE: Aritst is actually a user so ArtistSchema is in User Model

//  Creates a new artist given artist data (check user.model for ArtistSchema)
function createArtist(artistData) {
  const artist = new Model.Artist(artistData);
  return artist.save();
}

//  Sends all artist objects in array
function sendAllArtist(res) {
  Model.Artist.find({}).populate('art')
    .then(artists => res.send(artists))
    .catch(err => res.send(err));
}

//  Given an id will send specific artist object
function sendSingleArtist(id, res) {
  Model.Artist.findById(id).populate('art')
    .then(artist => res.send(artist))
    .catch(err => res.send(err));
}

module.exports = {
  sendAllArtist,
  sendSingleArtist,
  createArtist,
};
