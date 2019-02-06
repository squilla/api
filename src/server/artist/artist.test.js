const sinon = require('sinon');
const sinonTest = require('sinon-test');

const Model = require('../user/user.model');
const ArtistController = require('./artist.controller');

const test = sinonTest(sinon);
// eslint-disable-next-line no-undef
describe('Artist', () => {
  const artist = {
    firstName: 'Test',
    lastName: 'Dude',
    email: 'email@email.com',
    password: 'testPassword',
    nickname: 'testArtist',
    bio: 'Test bio for this test artist',
  };
  // eslint-disable-next-line no-undef
  it('Should Index ALL artists at GET: /api/artists', test(async function testIndex() {
    this.stub(Model.Artist, 'find').resolves([artist]);

    const req = {};
    const res = {
      send: this.spy(),
    };

    await ArtistController.Index(req, res);

    sinon.assert.calledOnce(Model.Artist.find);
    sinon.assert.calledOnce(res.send);
    sinon.assert.calledWith(res.send, [artist]);
  }));
  // eslint-disable-next-line no-undef
  it('Should GET specific artist at GET: /api/artists/:id', test(async function testGet() {
    this.stub(Model.Artist, 'findById').resolves(artist);

    const id = 50;
    artist._id = id; // eslint-disable-line no-underscore-dangle
    const req = {
      params: { id },
    };
    const res = {
      send: this.stub(),
    };

    await ArtistController.Get(req, res);

    sinon.assert.calledOnce(Model.Artist.findById);
    sinon.assert.calledOnce(res.send);
    sinon.assert.calledWith(res.send, artist);
  }));
});
