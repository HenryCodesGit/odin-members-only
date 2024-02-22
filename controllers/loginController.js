const User = require('../models/User')

const bcrypt = require('bcryptjs');
const passport = require('passport');

// Asynchandler automatically sends errors to the error handler
const asyncHandler = require('express-async-handler');

// To validate form results
const { body, validationResult } = require('express-validator');

//Render the form for creating a new user
exports.read_get = asyncHandler (async function(req, res, next) {
    const message = [];
    if(req.session.messages && req.session.messages.length){
        message.push(req.session.messages.pop()); //Only take the latest message
        req.session.messages.length = 0; //Clear the messages in session?
    }

    res.render('login', { title: 'Express' , errors: message});
});

exports.read_post = [
    body('email', 'Email field cannot be empty').escape(),
    body('password', 'Password field cannot be empty').escape(),
    asyncHandler (async function(req, res, next) {
        //Extract errors from validation/sanitization steps
        const validationErrors = validationResult(req);

        const userInfo = { 
            email: req.body.email, 
            password: await bcrypt.hash(req.body.password,10) 
        };

        if(!validationErrors.isEmpty()){
            // If errors exist, re-render the form with the error information presented to the user
            return res.render(
                'register', 
                {   
                    title: 'Express', 
                    userInfo, 
                    errors: validationErrors.array().map((error)=>error.msg) //TODO: errors also contains the field it belongs to. Can make more personalized error msg
                });
        } 

        next();
    }),
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureMessage: true,
    })
];
