const express = require('express');
const controller = require('./user.controller');
const wrap = require('../../middleware/asyncHandler');

const router = express.Router();

//  GET: returns all user objects in array (includes artists and reg users)
router.get('/', wrap(controller.Index));

//  GET: returns all Reg User objects in array (NOT artists)
router.get('/reg-users', wrap(controller.GetRegUsers));

//  GET: returns a specific user object from given Id (reg user or artist)
router.get('/:id', wrap(controller.Get));

//  DELETE: removes a specific user given Id (includes artists)
router.delete('/:id', wrap(controller.Delete));

//  PATCH: updates a users information (includes artist)
router.patch('/:id', wrap(controller.Update));

module.exports = router;
