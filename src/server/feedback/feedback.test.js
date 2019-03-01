const sinon = require('sinon');
const sinonTest = require('sinon-test');
require('sinon-mongoose');

const Model = require('./feedback.model');
const commentController = require('./types/comment.controller');
const feedbackController = require('./feedback.controller');
const reactionController = require('./types/reaction.controller');
require('../../config/config');

const test = sinonTest(sinon);

describe('Feedback', () => {
  let feedback;
  let reaction;

  beforeEach(() => {
    feedback = {
      _id: 50,
      art: 49,
      feedbackType: 'comment',
      content: 'This is a test comment',
    };

    reaction = {
      _id: 55,
      art: 56,
      feedbackType: 'reaction',
      reaction: 'Happy',
    };
  });


  it('Should INDEX all feedback (regardless of types at GET: /api/feedback', test(async function indexTest() {
    this.stub(Model.Feedback, 'find').resolves([feedback]);

    const req = {};
    const res = {
      send: this.spy(),
    };

    await feedbackController.Index(req, res);

    sinon.assert.calledOnce(Model.Feedback.find);
    sinon.assert.calledOnce(res.send);
    sinon.assert.calledWith(res.send, [feedback]);
  }));

  it('Should INDEX all Comment feedback types at GET: /api/feedback/comments', test(async function testCommentIndex() {
    this.stub(Model.Comment, 'find').resolves([feedback]);
    
    const req = {};
    const res = {
      send: this.spy(),
    };

    await commentController.Index(req, res);

    sinon.assert.calledOnce(Model.Comment.find);
    sinon.assert.calledOnce(res.send);
    sinon.assert.calledWith(res.send, [feedback]);
  }));

  it('Should INDEX all reaction feedback types at GET: /api/feedback/reactions', test(async function testReactionIndex() {
    this.stub(Model.Reaction, 'find').resolves([reaction]);

    const req = {};
    const res = {
      send: this.spy(),
    };

    await reactionController.Index(req, res);

    sinon.assert.calledOnce(Model.Reaction.find);
    sinon.assert.calledOnce(res.send);
    sinon.assert.calledWith(res.send, [reaction]);
  }));

  it('Should GET single feedback at GET: /api/feedback/:id', test(async function testGet() {
    this.stub(Model.Feedback, 'findById').resolves(feedback);
    const id = feedback._id; // eslint-disable-line no-underscore-dangle
    const req = {
      params: { id },
    };
    const res = {
      send: this.stub(),
    };

    await feedbackController.Get(req, res);

    sinon.assert.calledOnce(Model.Feedback.findById);
    sinon.assert.calledWith(Model.Feedback.findById, req.params.id);
    sinon.assert.calledOnce(res.send);
    sinon.assert.calledWith(res.send, feedback);
  }));

  it('Should CREATE new feedback at POST: /api/feedback', test(async function createTest() {
    this.stub(Model.Feedback, 'Create').resolves(feedback);
    const req = {
      body: {
        art: 50,
        feedbackType: 'comment',
        content: 'This is a test comment',
      },
    };
    const res = {
      send: this.stub(),
    };

    await feedbackController.Create(req, res);

    sinon.assert.calledOnce(Model.Feedback);
    sinon.assert.calledOnce(res.send);
  }));
});
