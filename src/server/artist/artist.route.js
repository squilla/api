const express = require('express');
const controller = require('./artist.controller');
const wrap = require('../../middleware/asyncHandler');

const router = express.Router();
//  NOTE: Aritst is actually a user so ArtistSchema is in User Model
//  Also the POST artist route is in the auth routes. DELETE and PATCH are in User route

//  GET: returns all Artist Objs in arr
router.get('/', wrap(controller.Index));

//  GET: returns a specific artist object
router.get('/:id', wrap(controller.Get));

module.exports = router;
