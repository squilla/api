const Model = require('./user.model');

// NOTE: user controller contains functions for regular users (RegUser)
//  and all users (both RegUser and Artits). All artist specific functions are in artist controller

//  Returns list of ALL user objects
function sendAllUsers(res) {
  Model.User.find({})
    .then(users => res.send(users))
    .catch(err => res.send(err));
}

//  sends specific user object (regardless of user type)
function sendSingleUser(id, res) {
  Model.User.findById(id)
    .then(user => res.send(user))
    .catch(err => res.send(err));
}

//  Deletes specific user given ID (regardless of user type)
function removeUser(id, res) {
  Model.User.findOneAndRemove({ _id: id })
    .then(() => res.status(200).send('User was successfully deleted'))
    .catch(err => res.status(400).send(err));
}

//  Updates specific user info (regardless of type)
function updateUser(id, userData, res) {
  Model.User.findById(id)
    .then((user) => {
      user.set(userData);
      return user.save();
    })
    .then(() => res.status(200).send('User info was updated'))
    .catch(err => res.status(400).send(err));
}

module.exports = {
  sendAllUsers,
  sendSingleUser,
  updateUser,
  removeUser,
};
