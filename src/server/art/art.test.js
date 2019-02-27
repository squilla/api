const fs = require('fs');
const path = require('path');
const rewire = require('rewire');
const sinon = require('sinon');
require('sinon-mongoose');

const ArtModel = require('./art.model'); // eslint-disable-line import/newline-after-import
const ArtController = rewire('./art.controller');

const s3 = ArtController.__get__('s3'); // eslint-disable-line no-underscore-dangle

describe('Art', () => {
  // TODO: Use sinon-mongoose to mock as document
  const art = {
    name: 'Tester',
    decription: 'Test art',
    url: 'https://squilla.s3.us-west-1.amazonaws.com/art/1551208845978',
    // TODO: Remove if mocked as document
    remove: sinon.stub().resolves(),
    save: sinon.stub().resolves(),
    isModified: sinon.stub().returns(true),
  };
  const file = {
    // TODO: Use Base64 image rather than file
    buffer: fs.readFileSync(path.join(__dirname, './test.png')),
  };

  const res = { json: sinon.spy() };

  const sandbox = sinon.createSandbox();
  let ArtMock = sinon.mock(ArtModel);

  afterEach(() => {
    res.json.resetHistory();

    // TODO: Remove if document is mocked
    art.remove.resetHistory();
    art.save.resetHistory();

    ArtMock.restore();
    sandbox.restore();

    // TODO: Figure out how not to reassign as findById can't be reassigned
    ArtMock = sinon.mock(ArtModel);
  });

  it('should INDEX all art', async () => {
    ArtMock
      .expects('find')
      .resolves([art]);

    const req = {};

    await ArtController.Index[0](req, res);

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, [art]);
  });

  it('should GET one random art', async () => {
    // Fix return
    sandbox.stub(Math, 'random').returns(0.5);

    ArtMock
      .expects('countDocuments')
      .resolves(42);

    ArtMock
      .expects('findOne')
      .chain('skip')
      .withArgs(21)
      .resolves(art);

    const req = {};

    await ArtController.GetRandom[0](req, res);

    ArtMock.verify();

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, art);
  });

  it('should CREATE new art', async () => {
    // Fix return
    sandbox.stub(Date, 'now').returns(1551208845978);

    // Stub S3 .upload()
    sandbox.stub(s3, 'upload').returns({
      promise: () => Promise.resolve({ Location: art.url }),
    });

    ArtMock
      .expects('create')
      .resolves(art);

    const req = { file };

    await ArtController.Create[1](req, res);

    ArtMock.verify();

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, art);
  });

  it('should GET one art', async () => {
    const id = 42;
    const req = {
      params: { id },
    };

    ArtMock
      .expects('findById')
      .withArgs(id)
      .resolves(art);

    await ArtController.Get[0](req, res);

    ArtMock.verify();

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, art);
  });

  it('should DELETE one art', async () => {
    const id = 42;
    const req = {
      params: { id },
    };

    // Stub S3 .objectDelete()
    sandbox.stub(s3, 'deleteObject').returns({
      promise: () => Promise.resolve(),
    });

    ArtMock
      .expects('findById')
      .withArgs(id)
      .resolves(art);

    await ArtController.Delete[0](req, res);

    ArtMock.verify();

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, art);
  });

  // TODO: Properly test modifying art fields
  it('should UPDATE one art', async () => {
    const id = 42;
    const req = {
      params: { id },
      file,
    };

    // Stub S3 .upload()
    sandbox.stub(s3, 'upload').returns({
      promise: () => Promise.resolve({ Location: art.url }),
    });

    ArtMock
      .expects('findById')
      .withArgs(id)
      .resolves(art);

    await ArtController.Update[1](req, res);

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, art);
  });
});
