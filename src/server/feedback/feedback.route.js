const express = require('express');
const wrap = require('express-async-handler');
const commentController = require('./types/comment.controller');
const reactionController = require('./types/reaction.controller');
const feedbackController = require('./feedback.controller');

const router = express.Router();

//  GET-Index: Returns all feedback (all types)
router.get('/', wrap(feedbackController.Index));

// GET-Index: Returns all Comment Feedback types ONLY
router.get('/comments', wrap(commentController.Index));

//  GET-Index: Returns all Reaction Feedback types ONLY
router.get('/reactions', wrap(reactionController.Index));

//  Returns all feedback for certain piece of art (art id is the art)
router.get('/art/:artId', wrap(feedbackController.GetArtFeedback));

//  GET-One: Returns single feedback object
router.get('/:id', wrap(feedbackController.Get));

//  POST: creates new feedback (type logic handled in feedback controller)
router.post('/', wrap(feedbackController.Create));

//  PATCH: Updated feedback info
router.patch('/:id', wrap(feedbackController.Update));

//  DELETE: Remove specific feedback object
router.delete('/:id', wrap(feedbackController.Delete));

module.exports = router;
