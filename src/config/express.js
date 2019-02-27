const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routes = require('../index.routes');
const checkAuth = require('../middleware/checkAuth');

const app = express();

//  Setup middleware:
app.use(cors());
app.use(cookieParser());
app.use(checkAuth);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//  Mount all routes on /api path
app.use('/api', routes);

module.exports = app;
