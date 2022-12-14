const express = require('express');
const indexRouter = require('./src/routes/index');
const errorHandler = require('./src/middlewares/errorHandler');
const logger = require('morgan');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(logger('dev'))

app.use('/api', indexRouter);

app.use(errorHandler);

module.exports = app;