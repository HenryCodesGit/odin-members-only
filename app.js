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

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

/*
-------------------------------------------------------------------------------------------
 Initialize 
-------------------------------------------------------------------------------------------
*/

// Default imports
var app = express();
viewEngineConfig(app);
defaultConfig(app);

/*
-------------------------------------------------------------------------------------------
 Imports 
-------------------------------------------------------------------------------------------
*/

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);




/*
-------------------------------------------------------------------------------------------
  Error Handling 
-------------------------------------------------------------------------------------------
*/

// If it gets this far, then assume 404 Error ?
// [TODO] Remove later
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
