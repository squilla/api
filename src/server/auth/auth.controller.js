const jwt = require('jsonwebtoken');
const Model = require('../user/user.model');
const config = require('../../config/config');

//  Creates new user
function signUp(userData) {
  const user = new Model.RegUser(userData);
  // user._t = 'RegUser';
  return user.save();
}

//  issues a cookie that authenticates user
function issueCookie(res, user) {
  const token = jwt.sign({ _id: user._id }, config.jwtSecret, { expiresIn: '60 days' }); // eslint-disable-line no-underscore-dangle
  res.cookie(config.cookie, token, { maxAge: 60 * 60 * 24 * 1000, httpOnly: true });
  res.status(200).send('User successfully signed in.');
}

//  Signs a user in using the compare password method
function signIn(email, password, res) {
  return Model.User.findOne({ email }, 'email password').then((user) => {
    if (!user) {
      return res.status(401).send('No user found with this email.');
    }
    //  compare the password with user method
    user.comparePassword(password, (err, isMatch) => {
      if (!isMatch) {
        return res.status(401).send('Email or password is incorrect.');
      }
      return true;
    });
    return issueCookie(res, user);
  }).catch(err => res.send(err));
}

//  Signs a user out (removes jwt token)
function signOut(res) {
  return res.clearCookie(config.cookie);
}

module.exports = {
  signUp,
  signIn,
  signOut,
  issueCookie,
};
