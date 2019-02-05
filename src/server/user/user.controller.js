const Model = require('./user.model');

// NOTE: user controller contains functions for regular users (RegUser)
//  and all users (both RegUser and Artists). All artist specific functions are in artist controller

//  Returns list of ALL user objects
async function Index(req, res) {
  res.send(await Model.User.find());
}

//  sends specific user object (regardless of user type)
async function Get(req, res) {
  res.send(await Model.User.findById(req.params.id));
}

//  Deletes specific user given ID (regardless of user type)
async function Delete(req, res) {
  res.send(await Model.User.findOneAndRemove({ _id: req.params.id }));
}

//  Updates specific user info (regardless of type)
async function Update(req, res) {
  res.send(await Model.User.findOneAndUpdate({ _id: req.params.id }, req.body));
}

//  Sends all Reg User objects only (disregards artists)
async function GetRegUsers(req, res) {
  res.send(await Model.RegUser.find({}));
}

module.exports = {
  Index,
  Get,
  Delete,
  GetRegUsers,
  Update,
};
