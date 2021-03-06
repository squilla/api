const express = require('express');
const wrap = require('express-async-handler');
const controller = require('./artist.controller');

const router = express.Router();
//  NOTE: Aritst is actually a user so ArtistSchema is in User Model
//  Also the POST artist route is in the auth routes. DELETE and PATCH are in User route

//  GET: returns all Artist Objs in arr
router.get('/', wrap(controller.Index));

//  GET: returns a specific artist object
router.get('/:id', wrap(controller.Get));

// GET: returns all art from specific artist
router.get('/:id/art', wrap(controller.GetArt));

module.exports = router;
