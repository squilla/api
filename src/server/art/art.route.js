const express = require('express');
const ArtController = require('./art.controller');

const router = express.Router();

router.get('/', ...ArtController.Index);

router.get('/random', ...ArtController.GetRandom);

router.get('/:id', ...ArtController.Get);

router.post('/', ...ArtController.Create);

router.patch('/:id', ...ArtController.Update);

router.delete('/:id', ...ArtController.Delete);

module.exports = router;
