const express = require('express');
const controller = require('./auth.controller');
const artistController = require('../artist/artist.controller');
const wrap = require('../../middleware/asyncHandler');

const router = express.Router();

//  GET: signs a user out and removes token
router.get('/sign-out', controller.SignOut);

//  POST: Signs up a new regular user and issues cookie
router.post('/sign-up', wrap((req, res) => {
  //  If user is artist, sign up as artist
  if (req.body.isArtist) {
    return artistController.Create(req, res);
  }
  return controller.SignUp(req, res);
}));

//  POST: signs in a user and issues a cookie
router.post('/sign-in', wrap(controller.SignIn));

module.exports = router;
