const User = require('../models/User')
const bcrypt = require('bcryptjs');

// Asynchandler automatically sends errors to the error handler
const asyncHandler = require('express-async-handler');

// To validate form results
const { body, validationResult } = require('express-validator');

//Render the form for creating a new user
exports.create_get = asyncHandler (async function(req, res, next) {
    res.render('register', { title: 'Express' , errors: []});
});

exports.create_post = [
    body('firstName', 'First name must be specified')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('lastName', 'Last name must be specified')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('email', 'Email must be specified')
        .trim()
        .isEmail().withMessage('Must be a valid email address (example: john.smith@gmail.ca)')
        .escape(),
    body('password', 'Password must be specified')
        .custom( val => !(/[^a-zA-z0-9]/).test(val)).withMessage('Password must only contain numbers and letters (a-z, A-Z, 0-9)')
        .isLength({min:10}).withMessage('Password must contain at least 10 characters')
        .escape(), //Validator shouldnt get this far, but let's have it just in case..
    asyncHandler (async function(req, res, next) {
        //Extract errors from validation/sanitization steps
        const validationErrors = validationResult(req);

        const hashedPassword = await bcrypt.hash(req.body.password,10);

        const info = {
            name: {
                first: req.body.firstName,
                last: req.body.lastName,
            },
            email: req.body.email,
            password: hashedPassword
        }

        if(!validationErrors.isEmpty()){
            // If errors exist, re-render the form with the error information presented to the user
            return res.render(
                'register', 
                {   
                    title: 'Express', 
                    info, 
                    errors: validationErrors.array().map((error)=>error.msg) //TODO: errors also contains the field it belongs to. Can make more personalized error msg
                });
        } 

        await new User(info).save();
        res.redirect('/'); //TODO Proper confirmation upon sign up
    })
];
