/*
-------------------------------------------------------------------------------------------
 Imports 
-------------------------------------------------------------------------------------------
*/

if(process.env.NODE_ENV === 'development') {
  console.log('Starting server in development mode');
  require('dotenv').config();
}

const express = require('express');
const createError = require('http-errors');

const viewEngineConfig = require('./config/viewEngine-config');
const defaultConfig = require('./config/default-config');

const mongooseConfig = require('./config/mongoose-config');
const MONGODB_URI = process.env.MONGODB_URI;

const topLevelErrors = require('./middleware/topLevelError-middleware');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

/*
-------------------------------------------------------------------------------------------
  Initialize 
-------------------------------------------------------------------------------------------
*/

//Connect to MongoDB
mongooseConfig(MONGODB_URI).catch(topLevelErrors.trigger);

// Default imports
var app = express();
topLevelErrors.initialize(app);
viewEngineConfig(app);
defaultConfig(app);

/*
-------------------------------------------------------------------------------------------
  Routes and middleware
-------------------------------------------------------------------------------------------
*/

// Middleware to catch top level errors (outside of routes);
app.use(topLevelErrors.middleware);

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

/*
-------------------------------------------------------------------------------------------
  Error Handling 
-------------------------------------------------------------------------------------------
*/

// If the route chain gets this far without returning a response, then assume 404 Error?
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {status: err.status};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
