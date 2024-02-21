const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        first: {type: String, required: true},
        last: {type: String, required: true},
    },
    username: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['new','member','admin'], default: 'new', required: true}
});

module.exports = mongoose.model('User', UserSchema);