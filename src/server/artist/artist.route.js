const express = require('express');
const controller = require('./artist.controller');

const router = express.Router();
//  NOTE: Aritst is actually a user so ArtistSchema is in User Model
//  Also the POST artist route is in the auth routes. DELETE and PATCH are in User route


//  GET: returns all Artist Objs in arr
router.get('/', (req, res) => controller.sendAllArtist(res));

//  GET: returns a specific artist object
router.get('/:id', (req, res) => controller.sendSingleArtist(req.params.id, res));


module.exports = router;
