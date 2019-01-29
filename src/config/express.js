const express = require('express');
const cookieParser = require('cookie-parser');
const routes = require('../index.routes');

const app = express();

//  Setup middleware:
app.use(cookieParser());
app.use(express.json());


//  Mount all routes on /api path
app.use('/api', routes);

module.exports = app;
