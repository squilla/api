const assert = require('assert');
const rewire = require('rewire');
const sinon = require('sinon');
const { mockReq, mockRes } = require('sinon-express-mock');
require('sinon-mongoose');

const { Artist: ArtistModel } = require('../user/user.model');
const ArtModel = require('./art.model'); // eslint-disable-line import/newline-after-import
const ArtController = rewire('./art.controller');

describe('Art', () => {
  const sampleArt = {
    name: 'Tester',
    decription: 'Test art',
    url: 'https://squilla.s3.us-west-1.amazonaws.com/art/1551208845978',
  };

  const sampleUser = {
    firstName: 'John',
    lastName: 'Smith',
    email: 'johnsmith@example.com',
    password: 'test123',
    isArtist: true,
    nickame: 'Johnny Boy',
    bio: 'I am just a test user',
  };

  describe('Middleware', () => {
    describe('checkIsArtist', () => {
      const checkIsArtist = ArtController.__get__('checkIsArtist');

      it('should call next', () => {
        const req = mockReq({
          isArtist: true,
        });
        const res = mockRes();
        const next = sinon.spy();

        checkIsArtist(req, res, next);

        sinon.assert.calledOnce(next);
      });

      it('should send error', () => {
        const req = mockReq({
          req: {
            isArtist: false,
          },
        });

        const res = mockRes();

        const next = sinon.spy();

        checkIsArtist(req, res, next);

        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status, 403);

        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, 'User is not an artist');
      });
    });

    describe('findDoc', () => {
      const findDoc = ArtController.__get__('findDoc');
      let ArtMock;

      beforeEach(() => {
        ArtMock = sinon.mock(ArtModel);
      });

      afterEach(() => {
        ArtMock.restore();
      });

      it('should call next', async () => {
        const id = 42;

        ArtMock
          .expects('findById')
          .withArgs(id)
          .resolves(sampleArt);

        const req = mockReq({
          params: { id },
        });
        const res = mockRes();
        const next = sinon.spy();

        await findDoc(req, res, next);

        ArtMock.verify();
        ArtMock.restore();

        assert.equal(sampleArt, req.art, 'req.art must be set to result of findById');

        sinon.assert.calledOnce(next);
      });

      it('should send error', async () => {
        const id = 42;

        ArtMock
          .expects('findById')
          .withArgs(id)
          .resolves(null);

        const req = mockReq({
          params: { id },
        });
        const res = mockRes();
        const next = sinon.spy();

        await findDoc(req, res, next);

        ArtMock.verify();
        ArtMock.restore();

        assert.equal(null, req.art, 'req.art must be set');

        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status, 400);

        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, 'Art does not exist');
      });
    });

    describe('checkOwnership', () => {
      const checkOwnership = ArtController.__get__('checkOwnership');


      it('should call next', () => {
        const user = new ArtistModel(sampleUser);
        const art = new ArtModel({ ...sampleArt, artist: user._id });

        const req = mockReq({ user, art });
        const res = mockRes();
        const next = sinon.spy();

        checkOwnership(req, res, next);

        sinon.assert.calledOnce(next);
      });

      it('should send error', () => {
        const user = new ArtistModel(sampleUser);
        const art = new ArtModel({ ...sampleArt, artist: user._id + 1 });

        const req = mockReq({ user, art });
        const res = mockRes();
        const next = sinon.spy();

        checkOwnership(req, res, next);

        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status, 403);

        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, 'Artist does not own this art');
      });
    });
  });

  describe('Routes', () => {
    const file = {
      buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=', 'base64'),
    };

    const s3 = ArtController.__get__('s3');

    const sandbox = sinon.createSandbox();

    afterEach(() => {
      sandbox.restore();
    });

    it('should INDEX all art', async () => {
      const ArtMock = sinon.mock(ArtModel);

      ArtMock
        .expects('find')
        .resolves([sampleArt] * 10);

      const req = mockReq();
      const res = mockRes();

      await ArtController.Index[0](req, res);

      ArtMock.verify();
      ArtMock.restore();

      sinon.assert.calledOnce(res.json);
      sinon.assert.calledWith(res.json, [sampleArt] * 10);
    });

    it('should GET one random art', async () => {
      const ArtMock = sinon.mock(ArtModel);

      // Fixes return
      sandbox.stub(Math, 'random').returns(0.5);

      ArtMock
        .expects('countDocuments')
        .resolves(42);

      ArtMock
        .expects('findOne')
        .chain('skip')
        .withArgs(21)
        .resolves(sampleArt);

      const req = mockReq();
      const res = mockRes();

      await ArtController.GetRandom[0](req, res);

      ArtMock.verify();
      ArtMock.restore();

      sinon.assert.calledOnce(res.json);
      sinon.assert.calledWith(res.json, sampleArt);
    });

    it('should CREATE new art', async () => {
      sandbox.stub(Date, 'now').returns(1551208845978);
      sandbox.stub(s3, 'upload').returns({
        promise: () => Promise.resolve({ Location: sampleArt.url }),
      });

      const ArtMock = sinon.mock(ArtModel);

      ArtMock
        .expects('create')
        .resolves(sampleArt);

      const req = mockReq({
        file,
        user: sampleUser,
      });
      const res = mockRes();

      await ArtController.Create[3](req, res);

      ArtMock.verify();
      ArtMock.restore();

      sinon.assert.calledOnce(res.json);
      sinon.assert.calledWith(res.json, sampleArt);
    });

    it('should GET one art', async () => {
      const req = mockReq({ art: sampleArt });
      const res = mockRes();

      ArtController.Get[1](req, res);

      sinon.assert.calledOnce(res.json);
      sinon.assert.calledWith(res.json, sampleArt);
    });

    it('should DELETE one art', async () => {
      const artMock = sinon.mock(new ArtModel(sampleArt));

      // Stub S3 .objectDelete()
      sandbox.stub(s3, 'deleteObject').returns({
        promise: () => Promise.resolve(),
      });

      artMock
        .expects('remove')
        .resolves();

      const req = mockReq({ art: artMock.object });
      const res = mockRes();

      await ArtController.Delete[4](req, res);

      artMock.verify();

      sinon.assert.calledOnce(res.json);
      sinon.assert.calledWith(res.json, artMock.object);
    });

    // TODO: Properly test modifying art fields
    it('should UPDATE one art', async () => {
      const artMock = sinon.mock(new ArtModel(sampleArt));
      const artMockObj = artMock.object;

      // Stub S3 .upload()
      sandbox.stub(s3, 'upload').returns({
        promise: () => Promise.resolve({ Location: artMockObj.url }),
      });

      artMock
        .expects('save')
        .resolves();

      const req = mockReq({ art: artMockObj });
      const res = mockRes();

      await ArtController.Update[5](req, res);

      artMock.verify();

      sinon.assert.calledOnce(res.json);
      sinon.assert.calledWith(res.json, artMock.object);
    });
  });
});
