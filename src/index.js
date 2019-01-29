const mongoose = require('mongoose');

const app = require('./config/express');

mongoose.Promise = Promise;

//  Connect to Mongo db


module.exports = app;
