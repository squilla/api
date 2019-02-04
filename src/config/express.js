const express = require('express');
const cookieParser = require('cookie-parser');
const routes = require('../index.routes');
const checkAuth = require('../middleware/checkAuth');

const app = express();

//  Setup check auth middleware
app.use(checkAuth);
//  Setup middleware:
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//  Mount all routes on /api path
app.use('/api', routes);

module.exports = app;
