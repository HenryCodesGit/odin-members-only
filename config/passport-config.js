const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs'); //TODO: in future different implementation for hashing than bcrypt

async function verifyFunction (username, password, done) {
    try {
        // Find user
        const user = await UserModel.findOne({ username: username });
         if (!user) return done(null, false, { message: "Incorrect username or password" });

        // Check password
        const passMatch = await bcrypt.compare(password, user.password)
        if (!passMatch) return done(null, false, { message: "Incorrect username or password" });

        //No errors? Return the user
        return done(null, user);
    } 
    catch(err) { return done(err);};
}

function serializeFunction(user, done) { return done(user.id); }
function deserializeFunction(UserModel) {
    return (
        async (id, done) => {
            try {
                const user = await UserModel.findById(id);
                done(null, user);
            } 
            catch(err) {
                done(err);
            };
        }
    )
}

function initialize(app, secret, UserModel) {
    //Session storage
    app.use(session({ secret, resave: false, saveUninitialized: true }));

    //Authentication strategy initialization
    passport.use(new LocalStrategy(verifyFunction));
    passport.serializeUser(serializeFunction);
    passport.deserializeUser(deserializeFunction(UserModel));

    //Initialize the passport and use the session /w passport
    app.use(passport.initialize());
    app.use(passport.session()); //TODO: Session should be stored in database, not memory

    //Return passport to be used by whichever outer app is calling it
    return passport;
}

module.exports = initialize;