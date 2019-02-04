const express = require('express');
const controller = require('./user.controller');

const router = express.Router();

//  GET: returns all user objects in array (includes artists and reg users)
router.get('/', (req, res) => controller.sendAllUsers(res));

//  GET: returns all Reg User objects in array (NOT artists)
router.get('/reg-users', (req, res) => controller.sendRegUsers(res));

//  GET: returns a specific user object from given Id (reg user or artist)
router.get('/:id', (req, res) => controller.sendSingleUser(req.params.id, res));

//  DELETE: removes a specific user given Id (includes artists)
router.delete('/:id', (req, res) => controller.removeUser(req.params.id, res));

//  PATCH: updates a users information (includes artist)
router.patch('/:id', (req, res) => controller.updateUser(req.params.id, req.body, res));

module.exports = router;
