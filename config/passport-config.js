const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs'); //TODO: in future different implementation for hashing than bcrypt

let User;

async function verifyFunction (email, password, done) {
    try {
        // Find user
        const user = await User.findOne({ email: email });
         if (!user) return done(null, false, { message: "Incorrect username or password" });

        // Check password
        const passMatch = await bcrypt.compare(password, user.password)
        if (!passMatch) return done(null, false, { message: "Incorrect username or password" });
        //No errors? Return the user

        return done(null, user);
    } 
    catch(err) { 
        return done(err);
    };
}

function serializeFunction(user, done) { return done(null,user.id); }
async function deserializeFunction(id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } 
    catch(err) {
        done(err);
    };
}

function initialize(app, secret, model) {

    //Setting the model to use for the verification
    User = model;

    //Session storage
    app.use(session({ secret, resave: false, saveUninitialized: true }));

    //Authentication strategy initialization
    passport.use(new LocalStrategy({ usernameField: 'email' },verifyFunction));
    passport.serializeUser(serializeFunction);
    passport.deserializeUser(deserializeFunction);

    //Initialize the passport and use the session /w passport
    app.use(passport.initialize());
    app.use(passport.session()); //TODO: Session should be stored in database, not memory
}

module.exports = initialize;