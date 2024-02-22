const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

const Message = require('../models/Message');

exports.index_get = function(req, res, next) {
    res.render('index', { title: 'Express', user: req.user });
};

exports.create_post = [
    body('message', 'Message must be specified')
        .trim()
        .isLength({min: 1})
        .escape(),
    asyncHandler (async function(req, res, next) {
        //Extract errors from validation/sanitization steps
        const validationErrors = validationResult(req);

        if(!validationErrors.isEmpty()){
            return res.render(
                '/', 
                {   
                    title: 'Express', 
                    errors: validationErrors.array().map((error)=>error.msg) //TODO: errors also contains the field it belongs to. Can make more personalized error msg
                });
        } 

        const info = {
            user: res.locals.currentUser._id,
            details: req.body.message
        }

        console.log(info.user);

        await new Message(info).save();

        res.redirect('/'); //TODO Proper confirmation upon sign up
    })
]