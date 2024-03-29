/*
-------------------------------------------------------------------------------------------
 Imports 
-------------------------------------------------------------------------------------------
*/

if(process.env.NODE_ENV === 'development') {
  console.log('Starting server in development mode');
  require('dotenv').config();
}
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;

const express = require('express');
const createError = require('http-errors');

const bcrypt = require('bcryptjs'); //TODO: in future different implementation for hashing than bcrypt. Also figure out how much to salt hashes.
const passportConfig = require('./config/passport-config');

const viewEngineConfig = require('./config/viewEngine-config');
const defaultConfig = require('./config/default-config');
const mongooseConfig = require('./config/mongoose-config');

const topLevelErrors = require('./middleware/topLevelError-middleware');

const User = require('./models/User');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

//TODO: Can probably make a route called /accounts/ and then have these routes as endpoints after
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const upgradeRouter = require('./routes/upgrade')

/*
-------------------------------------------------------------------------------------------
  Initialize 
-------------------------------------------------------------------------------------------
*/

//Connect to MongoDB
mongooseConfig(MONGODB_URI)
  .catch(topLevelErrors.trigger);

// Default imports
const app = express();
topLevelErrors.initialize(app);
viewEngineConfig(app);
defaultConfig(app);

// Initializing passport
// Passportconfig initializes and then returns the passport itself after
const passport = passportConfig(app,SESSION_SECRET,User); 

/*
-------------------------------------------------------------------------------------------
  Routes and middleware
-------------------------------------------------------------------------------------------
*/

// Middleware to catch top level errors (outside of routes);
app.use(topLevelErrors.middleware);

// Middleware to keep track of the current user in the session
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

//TODO: Can probably make a route called /accounts/ and then have these routes as endpoints after
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/upgrade', upgradeRouter);

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
