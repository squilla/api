const rewire = require('rewire');
const sinon = require('sinon');
require('sinon-mongoose');

const ArtModel = require('./art.model'); // eslint-disable-line import/newline-after-import
const ArtController = rewire('./art.controller');

const s3 = ArtController.__get__('s3'); // eslint-disable-line no-underscore-dangle

describe('Art', () => {
  const file = {
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=', 'base64'),
  };

  const res = { json: sinon.spy() };

  const sandbox = sinon.createSandbox();

  let artMock;
  let ArtMock;

  beforeEach(() => {
    // TODO: Figure out how to not reassign
    ArtMock = sinon.mock(ArtModel);
    artMock = sinon.mock(new ArtModel({
      name: 'Tester',
      decription: 'Test art',
      url: 'https://squilla.s3.us-west-1.amazonaws.com/art/1551208845978',
    }));
  });

  afterEach(() => {
    sandbox.restore();

    res.json.resetHistory();

    ArtMock.restore();
    artMock.restore();
  });

  it('should INDEX all art', async () => {
    ArtMock
      .expects('find')
      .resolves([artMock.object]);

    const req = {};

    await ArtController.Index[0](req, res);

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, [artMock.object]);
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
      .resolves(artMock.object);

    const req = {};

    await ArtController.GetRandom[0](req, res);

    ArtMock.verify();

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, artMock.object);
  });

  it('should CREATE new art', async () => {
    // Fix return
    sandbox.stub(Date, 'now').returns(1551208845978);

    // Stub S3 .upload()
    sandbox.stub(s3, 'upload').returns({
      promise: () => Promise.resolve({ Location: artMock.object.url }),
    });

    ArtMock
      .expects('create')
      .resolves(artMock.object);

    const req = { file };

    await ArtController.Create[1](req, res);

    ArtMock.verify();

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, artMock.object);
  });

  it('should GET one art', async () => {
    const id = 42;
    const req = {
      params: { id },
    };

    ArtMock
      .expects('findById')
      .withArgs(id)
      .resolves(artMock.object);

    await ArtController.Get[0](req, res);

    ArtMock.verify();

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, artMock.object);
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
      .resolves(artMock.object);

    artMock
      .expects('remove')
      .resolves();

    await ArtController.Delete[0](req, res);

    ArtMock.verify();
    artMock.verify();

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, artMock.object);
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
      promise: () => Promise.resolve({ Location: artMock.url }),
    });

    ArtMock
      .expects('findById')
      .withArgs(id)
      .resolves(artMock.object);

    artMock
      .expects('save')
      .resolves();

    artMock
      .expects('isModified')
      .returns(true);

    await ArtController.Update[1](req, res);

    ArtMock.verify();
    artMock.verify();

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, artMock.object);
  });
});
