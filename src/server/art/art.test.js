/* global describe it */
const sinon = require('sinon');
const sinonTest = require('sinon-test');

const ArtModel = require('./art.model');
const ArtController = require('./art.controller');

const test = sinonTest(sinon);

describe('Art', () => {
  const art = {
    url: 'https://www.google.com',
  };

  it('should INDEX art', test(async function indexTest() {
    this.stub(ArtModel, 'find').resolves([art]);

    const req = {};
    const res = {
      send: sinon.spy(),
    };

    await ArtController.Index(req, res);

    sinon.assert.calledOnce(ArtModel.find);

    sinon.assert.calledOnce(res.send);
    sinon.assert.calledWith(res.send, [art]);
  }));

  it('should CREATE art', test(async function createTest() {
    this.stub(ArtModel, 'create').resolves(art);

    const req = {
      body: art,
    };

    const res = {};
    res.send = this.spy();

    await ArtController.Create(req, res);

    sinon.assert.calledOnce(ArtModel.create);
    sinon.assert.calledWith(ArtModel.create, art);

    sinon.assert.calledOnce(res.send);
    sinon.assert.calledWith(res.send, art);
  }));

  it('should GET art', test(async function getTest() {
    this.stub(ArtModel, 'findById').resolves(art);

    const id = 42;
    const req = {
      params: { id },
    };

    const res = {
      send: sinon.stub(),
    };

    await ArtController.Get(req, res);

    sinon.assert.calledOnce(ArtModel.findById);
    sinon.assert.calledWith(ArtModel.findById, id);

    sinon.assert.calledOnce(res.send);
    sinon.assert.calledWith(res.send, art);
  }));

  it('should DELETE art', test(async function deleteTest() {
    this.stub(ArtModel, 'findByIdAndDelete').resolves(art);

    const id = 42;
    const req = {
      params: { id },
    };

    const res = {
      send: sinon.spy(),
    };

    await ArtController.Delete(req, res);

    sinon.assert.calledOnce(ArtModel.findByIdAndDelete);
    sinon.assert.calledWith(ArtModel.findByIdAndDelete, id);

    sinon.assert.calledOnce(res.send);
    sinon.assert.calledWith(res.send, art);
  }));

  it('should UPDATE art', test(async function updateTest() {
    this.stub(ArtModel, 'findByIdAndUpdate').resolves(art);

    const id = 42;
    const req = {
      params: { id },
      body: art,
    };

    const res = {
      send: sinon.stub(),
    };

    await ArtController.Update(req, res);

    sinon.assert.calledOnce(ArtModel.findByIdAndUpdate);
    sinon.assert.calledWith(ArtModel.findByIdAndUpdate, id, art);

    sinon.assert.calledOnce(res.send);
    sinon.assert.calledWith(res.send, art);
  }));
});
