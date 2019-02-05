const express = require('express');
const controller = require('./auth.controller');
const artistController = require('../artist/artist.controller');
const wrap = require('../../middleware/asyncHandler');

const router = express.Router();

//  POST: Signs up a new regular user and issues cookie
router.post('/sign-up', wrap((req, res) => {
  if (req.body.isArtist) {
    artistController.Create(req, res);
  } else {
    return controller.SignUp(req, res);
  }
  return 0;
}));

//  POST: signs in a user and issues a cookie
router.post('/sign-in', wrap(controller.SignIn));

//  GET: signs a user out and removes token
router.get('/sign-out', wrap(controller.SignOut));

module.exports = router;
