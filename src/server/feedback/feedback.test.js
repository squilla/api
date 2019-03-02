const sinon = require('sinon');

const rewire = ('rewire');

// const commentController = rewire('./types/comment.controller');
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

  it('Should GET one feedback item by id at GET: /api/feedback/:id', async () => {
    const id = 44;
    const req = {
      params: { id },
    };

    feedbackMock
      .expects('findById')
      .withArgs(id)
      .resolves(feedbackMock.object);

    await feedbackController.Get[0](req, res);

    //  test that res.send was called and sending a feedback obj
    sinon.assert.calledOnce(res.send);
    sinon.assert.calledWith(res.send, feedbackMock.object);
  });

  it('Should POST and Create a new piece of feedback at POST: /api/feedback', async () => {
    const req = {
      body: feedbackMock.object,
    };

    feedbackMock
      .expects('.save')
      .resolves(feedbackMock.object);

    await feedbackController.Create[0](req, res);

    //  test that res.send is being called with a feedback obj
    sinon.assert.calledOnce(res.send);
    sinon.assert.calledWith(feedbackMock.object);
  });
});
