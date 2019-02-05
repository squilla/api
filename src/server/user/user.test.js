const sinon = require('sinon');
const sinonTest = require('sinon-test');

const UserModel = require('./user.model');
const UserController = require('./user.controller');

const test = sinonTest(sinon);

describe('User', () => {
  const user = {
    firstName: 'Test',
    lastName: 'Dude',
    email: 'email@email.com',
    password: 'testPassword',
  };

  it('Should Index ALL Users (artists included) at GET: /api/users', test(async function indexTest() {
    this.stub(UserModel.User, 'find').resolves([user]);

    const req = {};
    const res = {
      send: this.spy(),
    };

    await UserController.Index(req, res);

    sinon.assert.calledOnce(UserModel.User.find);
    sinon.assert.calledOnce(res.send);
    sinon.assert.calledWith(res.send, [user]);
  }));

  it('Should send specific user given ID at GET: /api/users/:id', test(async function getTest() {
    this.stub(UserModel.User, 'findById').resolves(user);
    const id = 50;
    const req = {
      params: { id },
    };
    const res = {
      send: this.stub(),
    };

    await UserController.Get(req, res);

    sinon.assert.calledOnce(UserModel.User.findById);
    sinon.assert.calledWith(UserModel.User.findById, id);
    sinon.assert.calledOnce(res.send);
    sinon.assert.calledWith(res.send, user);
  }));

  it('Should DELETE a specific user at DELETE: /api/users/:id', test(async function testDelete() {
    this.stub(UserModel.User, 'findOneAndRemove').resolves(user);

    const id = 50;
    const req = {
      params: { id },
    };
    const res = {
      send: this.spy(),
    };

    await UserController.Delete(req, res);

    sinon.assert.calledOnce(UserModel.User.findOneAndRemove);
    sinon.assert.calledOnce(res.send);
    sinon.assert.calledWith(res.send, user);
  }));

  it('Should UPDATE user info at PATCH: /api/users/:id', test(async function updateTest() {
    this.stub(UserModel.User, 'findOneAndUpdate').resolves(user);

    const id = 50;
    const req = {
      params: { id },
    };
    const res = {
      send: this.spy(),
    };

    await UserController.Update(req, res);

    sinon.assert.calledOnce(UserModel.User.findOneAndUpdate);
    sinon.assert.calledOnce(res.send);
    sinon.assert.calledWith(res.send, user);
  }));
});
