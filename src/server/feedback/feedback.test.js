const sinon = require('sinon');

const rewire = ('rewire');
const Model = require('./feedback.model');

const commentController = rewire('./types/comment.controller');
const feedbackController = rewire('./feedback.controller');
const reactionController = rewire('./types/reaction.controller');
require('../../config/config');
require('sinon-mongoose');


describe('Feedback', () => {
  let feedbackMock; // mock feedback for testing
  let reactionMock; // mock reaction for testing

  // sets up the sinon spy in the response
  const res = { json: sinon.spy() };
  // creates a new sinon sandbox
  const sandbox = sinon.createSandbox();
  beforeEach(() => {
    feedbackMock = {
      _id: 50,
      art: 49,
      feedbackType: 'comment',
      content: 'This is a test comment',
    };

    reactionMock = {
      _id: 55,
      art: 56,
      feedbackType: 'reaction',
      reaction: 'Happy',
    };
  });

  afterEach(() => {
    // restores sandbox, resetting spyz
    sandbox.restore();
    // reset the json history
    res.json.resetHistory();
    // reset the mocks
    reactionMock.restore();
    feedbackMock.restore();
  });

  it('Should INDEX all feedback regardless of type at GET: /api/feedback', async () => {
    feedbackMock
      .expects('find')
      .resolves([feedbackMock.object]);

    const req = {};

    await feedbackController.Index[0](req, res);

    sinon.assert.calledOnce(res.send);
    //  make sure res.send is called with feedback object
    sinon.assert.calledWith(res.send, [feedbackMock.object]);
  });

  it('Should INDEX all reaction feedback types at GET: /api/feedback/reactions', async () => {
    reactionMock
      .expects('find')
      .resolves([reactionMock.object]);

    const req = {};

    await reactionController.Index[0](req, res);

    //  make sure res.send is called with reaction object
    sinon.assert.calledOnce(res.send);
    sinon.assert.calledWith(res.send, reactionMock.object);
  });

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
