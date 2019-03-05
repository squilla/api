const rewire = require('rewire');
const sinon = require('sinon');

const Model = require('./feedback.model');
// const commentController = rewire('./types/comment.controller');
const feedbackController = rewire('./feedback.controller');
const reactionController = rewire('./types/reaction.controller');
require('../../config/config');
require('sinon-mongoose');

const feedbackBody = {
  _id: 55,
  art: 56,
  author: 59,
  feedbackType: 'reaction',
  reaction: 'sad',
};

describe('Feedback', () => {
  let feedbackMock; // mock feedback for testing
  let reactionMock; // mock reaction for testing
  let FeedbackMock; // mock for feedback model
  let ReactionMock; // mock for ReactionModel

  // sets up the sinon spy in the response
  const res = { send: sinon.spy() };
  // creates a new sinon sandbox
  const sandbox = sinon.createSandbox();
  beforeEach(() => {
    // setup sinon mocks for testing
    FeedbackMock = sinon.mock(Model.Feedback);
    ReactionMock = sinon.mock(Model.Reaction);
    feedbackMock = sinon.mock(new Model.Feedback({
      _id: 50,
      art: 49,
      author: 555,
      feedbackType: 'comment',
      content: 'This is a test comment',
    }));

    reactionMock = sinon.mock(new Model.Reaction({
      _id: 55,
      art: 56,
      author: 59,
      feedbackType: 'reaction',
      reaction: 'sad',
    }));
  });

  afterEach(() => {
    // restores sandbox, resetting spyz
    sandbox.restore();
    // reset the json history
    res.send.resetHistory();
    // reset the mocks
    reactionMock.restore();
    feedbackMock.restore();
    ReactionMock.restore();
    FeedbackMock.restore();
  });

  it('Should INDEX all feedback regardless of type at GET: /api/feedback', async () => {
    FeedbackMock
      .expects('find')
      .resolves([feedbackMock.object]);

    const req = {};
    // call feedbacks index function
    await feedbackController.Index(req, res);

    sinon.assert.calledOnce(res.send);
    //  make sure res.send is called with feedback object
    sinon.assert.calledWith(res.send, [feedbackMock.object]);
  });

  it('Should INDEX all reaction feedback types at GET: /api/feedback/reactions', async () => {
    ReactionMock
      .expects('find')
      .resolves([reactionMock.object]);

    const req = {};

    await reactionController.Index(req, res);

    //  make sure res.send is called with reaction object
    sinon.assert.calledOnce(res.send);
    sinon.assert.calledWith(res.send, [reactionMock.object]);
  });

  it('Should GET one feedback item by id at GET: /api/feedback/:id', async () => {
    const id = 44;
    const req = {
      params: { id },
    };

    FeedbackMock
      .expects('findById')
      .withArgs(id)
      .resolves(feedbackMock.object);

    await feedbackController.Get(req, res);

    FeedbackMock.verify(); // verify

    //  test that res.send was called and sending a feedback obj
    sinon.assert.calledOnce(res.send);
  });

  it('Should POST and Create a new piece of feedback at POST: /api/feedback', async () => {
    const req = {
      body: feedbackBody,
    };

    ReactionMock
      .expects('create')
      .resolves(reactionMock.object);
    try {
      await reactionController.Create(req, res);
    } catch (err) {
      console.log(err) // eslint-disable-line
    }
    ReactionMock.verify();
    //  test that res.send is being called with a feedback obj
    sinon.assert.calledOnce(res.send);
    sinon.assert.calledOnce('create');
    sinon.assert.calledWith('create', req.body);
    sinon.assert.calledWith(res.send, reactionMock.object);
  });
});
