const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema; // eslint-disable-line
const options = { discriminatorKey: 'kind' };

const BaseSchema = new Schema({
  createdAt: { type: Date, default: Date.now() },
  updateAt: { type: Date },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isArtist: { type: Boolean, default: false },
}, options);

//  A pre save method on the user that hashes the password
BaseSchema.pre('save', function userPreSave(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null);
  return next();
});
//  User method that compares password against the hash
BaseSchema.methods.comparePassword = function comparePassword(password, done) {
  bcrypt.compareSync(password, this.password, (err, isMatch) => done(err, isMatch));
};

//  Setting up user model (note: artist and reguser will be discriminators of this)
const User = mongoose.model('User', BaseSchema);

//  Setting up Artist Schema
const ArtistSchema = new Schema({
  nickname: { type: String, required: true },
  bio: { type: String, required: false },
  art: [{ type: Schema.Types.ObjectId, ref: 'Art' }],
  favorites: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, options);


// requireIf function makes the artist credentials required if they are an artist
function requireIf() {
  return this.isArtist === 'true';
}
//  makes these fields true
ArtistSchema.path('nickname').required(requireIf());
ArtistSchema.path('bio').required(requireIf());
//  Setting up artist discriminator
const Artist = User.discriminator('Artist', ArtistSchema);

//  Setup regular user
const RegUserSchema = new Schema({
  favoriteArtist: [{ type: Schema.Types.ObjectId, ref: 'Artist' }],
  favoritedArt: [{ type: Schema.Types.ObjectId, red: 'Art' }],
}, options);
//  Making reg user a discriminator of User
const RegUser = User.discriminator('RegUser', RegUserSchema);

module.exports = {
  User,
  Artist,
  RegUser,
};
