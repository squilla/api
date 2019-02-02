const express = require('express');
const controller = require('./auth.controller');

const router = express.Router();

//  POST: Signs up a new regular user and issues cookie
router.post('/sign-up', (req, res) => {
  if (req.body.isArtist) {
    // Do logic to create new artist instead of base user
  } else {
    controller.signUp(req.body)
      .then(user => controller.issueCookie(res, user))
      .catch(err => res.send(err));
  }
});

//  POST: signs in a user and issues a cookie
router.post('/sign-in', (req, res) => controller.signIn(req.body.email, req.body.password, res));

//  GET: signs a user out and removes token
router.get('/sign-out', (req, res) => {
  controller.signOut(res);
  return res.send('User was signed out.');
});

module.exports = router;
