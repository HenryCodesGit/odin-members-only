const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

const createError = require('http-errors');

const User = require('../models/User')

const MEMBER_CODE = process.env.MEMBER_CODE;
const ADMIN_CODE = process.env.ADMIN_CODE;

exports.upgrade_get = asyncHandler (async function(req, res, next) {
    if(!res.locals.currentUser) return next(createError(403));

    res.render('upgrade', {title: 'Upgrade Account', errors: []});
}); 

exports.upgrade_post = [
    body('code').trim().escape(),
    asyncHandler (async function(req, res, next) {
        const code = req.body.code;

        //TODO: Upgrade code is just a process.env key, but should probably have it as a hashed password stored in database?
        switch(code){
            case MEMBER_CODE:
                await User.findByIdAndUpdate(res.locals.currentUser,{status: 'member'}).exec();
                res.redirect('/');
                break;
            case ADMIN_CODE:
                await User.findByIdAndUpdate(res.locals.currentUser,{status: 'admin'}).exec();
                res.redirect('/');
                break;    
            default:
                res.redirect('/upgrade');
                break;
        }
    })
]; 