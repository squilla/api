const jwt = require('jsonwebtoken');
const Model = require('../user/user.model');
const config = require('../../config/config');


//  issues a cookie that authenticates user
function issueCookie(res, user) {
  const token = jwt.sign({ _id: user._id }, config.jwtSecret, { expiresIn: '60 days' }); // eslint-disable-line no-underscore-dangle
  res.cookie(config.cookie, token, { maxAge: 60 * 60 * 24 * 1000, httpOnly: true });
  return res.status(200).send('User successfully signed in.');
}

//  Creates new user
async function SignUp(req, res) {
  const user = await new Model.RegUser(req.body);
  await user.save();
  return issueCookie(res, user);
}

//  Signs a user in using the compare password method
async function SignIn(req, res) {
  const user = await Model.User.findOne({ email: req.body.email }, 'email password');
  if (!user) {
    return res.status(401).send('No user found with this email.');
  }
  //  User users compare password method to compare against hash
  user.comparePassword(user.password, (err, isMatch) => {
    if (!isMatch) {
      return res.status(401).send('Email or password is incorrect.');
    }
    return true;
  });
  return issueCookie(res, user);
}

//  Signs a user out (removes jwt token)
function SignOut(req, res) {
  res.clearCookie(config.cookie);
  return res.status(200).send('User was successfully signed out.');
}

module.exports = {
  SignUp,
  SignIn,
  SignOut,
  issueCookie,
};
