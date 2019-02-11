const express = require('express');
const ArtController = require('./art.controller');

const router = express.Router();

router.get('/', ...ArtController.Index);

router.post('/', ...ArtController.Create);

router.get('/:id', ...ArtController.Get);

router.patch('/:id', ...ArtController.Update);

router.delete('/:id', ...ArtController.Delete);

module.exports = router;
