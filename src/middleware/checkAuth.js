const jwt = require('jsonwebtoken');
const Model = require('../server/user/user.model');
const config = require('../config/config');

//  Middleware the checks if user is logged in. Also checks if user is an artist
module.exports = (req, res, next) => {
  if (req.cookies.config.cookie === undefined || req.cookies.config.cookie === null) {
    req.user = null;
    req.isArtist = false;
    return next();
  }
  const token = req.cookies.config.cookie;
  const uid = jwt.decode(token, config.jwtSecret)._id; // eslint-disable-line no-underscore-dangle
  Model.User.findById(uid)
    .then((user) => {
      if (user.isArtist) {
        req.isArtist = true;
      }
      req.user = user;
      res.locals.user = user;
      return next();
    })
    .catch(err => res.send(err));
  return 0;
};
