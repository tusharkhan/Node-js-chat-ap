var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
var mongoose = require('mongoose');

var {notFound, errorHandler} = require('./helpers/errorHandle');

dotenv.config();
mongoose.connect(process.env.MONGOOSE_URL_STRING).then(() => {
  console.log('Connected to Mongoose');
}).catch((error) => {
  console.error(error);
});

// all routes
var loginRouter = require('./routes/login');
var usersRouter = require('./routes/users');
var inboxRouter = require('./routes/inbox');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', loginRouter);
app.use('/users', usersRouter);
app.use('/inbox', inboxRouter);

// catch 404 and forward to error handler
app.use(notFound);

// error handler
app.use(errorHandler);

module.exports = app;
