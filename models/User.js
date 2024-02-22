const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    name: {
        first: {type: String, required: true},
        last: {type: String, required: true},
    },
    email: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['new','member','admin'], default: 'new'}
});

UserSchema.virtual('canSeePosts').get(function(){
    return ['member','admin'].includes(this.status);
})

UserSchema.virtual('canEditPosts').get(function(){
    return ['admin'].includes(this.status);
})

UserSchema.plugin(passportLocalMongoose,{usernameField: 'email'});


module.exports = mongoose.model('User', UserSchema);