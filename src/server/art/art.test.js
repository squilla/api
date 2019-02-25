const sinon = require('sinon');
require('sinon-mongoose');

const ArtModel = require('./art.model');
const ArtController = require('./art.controller');

describe('Art', () => {
  const art = { url: 'https://www.google.com' };
  const res = { json: sinon.spy() };

  const sandbox = sinon.createSandbox();
  const ArtMock = sinon.mock(ArtModel);

  afterEach(() => {
    res.json.resetHistory();
    ArtMock.restore();
    sandbox.restore();
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
    ArtMock
      .expects('countDocuments')
      .resolves(42);

    sandbox.stub(Math, 'random').returns(0.5);

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
    ArtMock
      .expects('create')
      .resolves(art);

    const req = {
      file: { location: art.url },
    };

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

    ArtMock
      .expects('findByIdAndDelete')
      .withArgs(id)
      .resolves(art);

    await ArtController.Delete[0](req, res);

    ArtMock.verify();

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, art);
  });

  it('should UPDATE one art', async () => {
    const id = 42;
    const req = {
      params: { id },
      body: art,
    };

    ArtMock
      .expects('findByIdAndUpdate')
      .withArgs(id, art)
      .resolves(art);

    await ArtController.Update[0](req, res);

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, art);
  });
});
