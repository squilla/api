const sinon = require('sinon');
const sinonTest = require('sinon-test');
const rewire = require('rewire');

const ArtModel = require('./art.model'); // eslint-disable-line import/newline-after-import
const ArtController = rewire('./art.controller');

const art = { url: 'https://www.google.com' };

// TODO: Find better solution
// eslint-disable-next-line no-underscore-dangle
// ArtController.__set__('uploadArt', async (req) => {
//   req.file = { location: art.url };
// });

const test = sinonTest(sinon);

describe('Art', () => {
  const res = { json: sinon.spy() };

  beforeEach(() => {
    sinon.resetHistory();
  });

  it('should INDEX all art', test(async function indexTest() {
    this.stub(ArtModel, 'find').resolves([art]);

    const req = {};

    await ArtController.Index[0](req, res);

    sinon.assert.calledOnce(ArtModel.find);

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, [art]);
  }));

  it('should CREATE new art', test(async function createTest() {
    this.stub(ArtModel, 'create').resolves(art);

    const req = { file: { location: art.url } };

    await ArtController.Create[1](req, res);

    sinon.assert.calledOnce(ArtModel.create);
    sinon.assert.calledWith(ArtModel.create, art);

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, art);
  }));

  it('should GET one art', test(async function getTest() {
    this.stub(ArtModel, 'findById').resolves(art);

    const id = 42;
    const req = { params: { id } };

    await ArtController.Get[0](req, res);

    sinon.assert.calledOnce(ArtModel.findById);
    sinon.assert.calledWith(ArtModel.findById, id);

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, art);
  }));

  it('should DELETE one art', test(async function deleteTest() {
    this.stub(ArtModel, 'findByIdAndDelete').resolves(art);

    const id = 42;
    const req = { params: { id } };

    await ArtController.Delete[0](req, res);

    sinon.assert.calledOnce(ArtModel.findByIdAndDelete);
    sinon.assert.calledWith(ArtModel.findByIdAndDelete, id);

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, art);
  }));

  it('should UPDATE one art', test(async function updateTest() {
    this.stub(ArtModel, 'findByIdAndUpdate').resolves(art);

    const id = 42;
    const req = {
      params: { id },
      body: art,
    };

    await ArtController.Update[0](req, res);

    sinon.assert.calledOnce(ArtModel.findByIdAndUpdate);
    sinon.assert.calledWith(ArtModel.findByIdAndUpdate, id, art);

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, art);
  }));

  after(() => {
    sinon.restore();
  });
});
